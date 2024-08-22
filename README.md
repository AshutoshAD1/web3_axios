# VotingImgs Smart Contract

## Blockchain used - Ethereum

-> Contract Address - 0x9d3e423ab912541d84b12bd9fcb93cd2af283d5a
-> To view verified contract go to sepolia.etherscan.io and put this contract address

## Overview

#### The VotingImgs smart contract allows users to create tasks where multiple images compete for votes. Users can vote on their favorite images within a task, and once the target number of votes is reached, the task is marked as completed, and the winning image can be determined.

### Contract Structure

1. Structs
   > Task: Represents a task created by a user.

> title: The title of the task.
> img: An array of Image structs associated with the task.
> targetVotes: The number of votes required to complete the task.
> isCompleted: A boolean indicating whether the task has been completed.
> Image: Represents an image within a task.

> votes: The number of votes the image has received.
> cid: The content identifier (CID) for the image.
> AllTasks: Represents a summary of all tasks.

> title: The title of the task.
> creator: The address of the user who created the task.
> id: The unique identifier of the task.

2. Mappings

   > tasks: Maps a user’s address to an array of Task structs. This stores all the tasks created by each user.
   > votedByUser: Tracks whether a specific user has voted on a specific task by another user. It is a triple mapping: votedByUser[voter][taskOwner][taskId].

3. State Variables
   > allTasks: An array of AllTasks structs that holds a summary of all created tasks across all users.

### Functions Overview

1. createTask(string calldata \_title, string[] calldata imgs, uint256 \_targetVotes)

   > Allows a user to create a new task with a title, a list of images, and a target number of votes. The task is stored under the user’s address and added to the allTasks list.

2. voteTaskImg(address addr, uint256 id, uint256 \_imgId)

   > Allows a user to vote on a specific image within a task. It checks that the task is still ongoing and that the user has not voted on it before. If the target number of votes is reached, the task is marked as completed.

3. getWinner(address addr, uint256 id) public view returns (string memory cid)

   > Returns the CID of the winning image in a completed task. It determines the winner by finding the image with the most votes.

4. getYourTasks() public view returns (Task[] memory)

   > Returns all tasks created by the caller.

5. getAllTasks() public view returns (AllTasks[] memory)

   > Returns a summary list of all tasks created by all users.

6. isCompleted(address addr, uint256 id) public view returns (bool)

   > Checks if a specific task has been completed.

7. getSpecificTask(address addr, uint256 \_id) public view returns (Task memory)
   > Returns the details of a specific task, including all images and their current vote counts.
   > Usage

#### Creating Tasks:

> Use createTask to create a new voting task with a list of images and a target number of votes.
> Voting:

> Use voteTaskImg to vote on a specific image within a task. Ensure you haven't voted on that task before.
> Checking Results:

> Use getWinner to see which image won in a completed task.

### Viewing Tasks:

> Use getYourTasks to view tasks you’ve created and getAllTasks to view a list of all tasks.
> Use getSpecificTask to get detailed information on a specific task.
