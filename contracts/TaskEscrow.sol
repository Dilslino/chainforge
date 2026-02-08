// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TaskEscrow
 * @dev A decentralized task marketplace with ETH escrow functionality.
 * Users post tasks with ETH locked in escrow. Workers claim, complete tasks,
 * and receive payment upon creator approval.
 */
contract TaskEscrow is ReentrancyGuard, Ownable {
    // Task status enum
    enum TaskStatus {
        Open,       // Task created, waiting for worker
        Claimed,    // Worker has claimed the task
        Completed,  // Worker marked as complete, awaiting approval
        Approved    // Creator approved, payment released
    }

    // Task structure
    struct Task {
        bytes32 taskId;
        address creator;
        address worker;
        uint256 amount;
        TaskStatus status;
        uint256 createdAt;
    }

    // Platform fee percentage (2%)
    uint256 public constant PLATFORM_FEE_PERCENT = 2;

    // Fee recipient address
    address public feeRecipient;

    // Mapping from taskId to Task
    mapping(bytes32 => Task) public tasks;

    // Array of all task IDs for enumeration
    bytes32[] public taskIds;

    // Events
    event TaskCreated(bytes32 indexed taskId, address indexed creator, uint256 amount);
    event TaskClaimed(bytes32 indexed taskId, address indexed worker);
    event TaskCompleted(bytes32 indexed taskId, address indexed worker);
    event PaymentReleased(bytes32 indexed taskId, address indexed worker, uint256 workerAmount, uint256 feeAmount);
    event TaskCancelled(bytes32 indexed taskId, address indexed creator, uint256 refundAmount);

    constructor() Ownable(msg.sender) {
        feeRecipient = msg.sender;
    }

    /**
     * @dev Create a new task with ETH escrow
     * @param taskId Unique identifier for the task
     */
    function createTask(bytes32 taskId) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH for task");
        require(tasks[taskId].creator == address(0), "Task ID already exists");

        tasks[taskId] = Task({
            taskId: taskId,
            creator: msg.sender,
            worker: address(0),
            amount: msg.value,
            status: TaskStatus.Open,
            createdAt: block.timestamp
        });

        taskIds.push(taskId);

        emit TaskCreated(taskId, msg.sender, msg.value);
    }

    /**
     * @dev Claim an open task as a worker
     * @param taskId The task to claim
     */
    function claimTask(bytes32 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.creator != address(0), "Task does not exist");
        require(task.status == TaskStatus.Open, "Task is not open");
        require(msg.sender != task.creator, "Creator cannot claim own task");

        task.worker = msg.sender;
        task.status = TaskStatus.Claimed;

        emit TaskClaimed(taskId, msg.sender);
    }

    /**
     * @dev Mark a task as complete (worker only)
     * @param taskId The task to mark complete
     */
    function completeTask(bytes32 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.creator != address(0), "Task does not exist");
        require(task.status == TaskStatus.Claimed, "Task is not claimed");
        require(msg.sender == task.worker, "Only worker can complete");

        task.status = TaskStatus.Completed;

        emit TaskCompleted(taskId, msg.sender);
    }

    /**
     * @dev Approve task and release payment (creator only)
     * @param taskId The task to approve
     */
    function approveTask(bytes32 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.creator != address(0), "Task does not exist");
        require(task.status == TaskStatus.Completed, "Task is not completed");
        require(msg.sender == task.creator, "Only creator can approve");

        task.status = TaskStatus.Approved;

        // Calculate payment splits
        uint256 feeAmount = (task.amount * PLATFORM_FEE_PERCENT) / 100;
        uint256 workerAmount = task.amount - feeAmount;

        // Transfer to worker
        (bool workerSuccess, ) = task.worker.call{value: workerAmount}("");
        require(workerSuccess, "Worker payment failed");

        // Transfer fee to platform
        (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
        require(feeSuccess, "Fee payment failed");

        emit PaymentReleased(taskId, task.worker, workerAmount, feeAmount);
    }

    /**
     * @dev Cancel an unclaimed task and refund creator
     * @param taskId The task to cancel
     */
    function cancelTask(bytes32 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        require(task.creator != address(0), "Task does not exist");
        require(task.status == TaskStatus.Open, "Can only cancel open tasks");
        require(msg.sender == task.creator, "Only creator can cancel");

        uint256 refundAmount = task.amount;
        task.amount = 0;
        task.status = TaskStatus.Approved; // Reuse approved as "closed" state

        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit TaskCancelled(taskId, msg.sender, refundAmount);
    }

    /**
     * @dev Get task details
     * @param taskId The task ID to query
     */
    function getTask(bytes32 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }

    /**
     * @dev Get total number of tasks
     */
    function getTaskCount() external view returns (uint256) {
        return taskIds.length;
    }

    /**
     * @dev Get task ID by index
     * @param index The index in taskIds array
     */
    function getTaskIdByIndex(uint256 index) external view returns (bytes32) {
        require(index < taskIds.length, "Index out of bounds");
        return taskIds[index];
    }

    /**
     * @dev Update fee recipient (owner only)
     * @param newFeeRecipient The new fee recipient address
     */
    function setFeeRecipient(address newFeeRecipient) external onlyOwner {
        require(newFeeRecipient != address(0), "Invalid address");
        feeRecipient = newFeeRecipient;
    }
}
