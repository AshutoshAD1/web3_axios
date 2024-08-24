// SPDX-License-Identifier: UNLICENSED


pragma solidity >=0.7.0 <0.9.0;

contract VotingImgs{                 
    struct Task{
        string title;
        Image[] img;
        uint256 targetVotes;
        bool isCompleted;
    }

    // task 
    struct Image{
        uint256 votes;
        string cid;
    }

    
    struct AllTasks{
        string title;
        address creator;
        uint256 id;

    }
    AllTasks[] public allTasks;
    

    mapping(address=>Task[]) public  tasks;
    mapping(address=>mapping(address=>mapping(uint256=>bool))) public  votedByUser;
    
    modifier taskNotCompleted(address addr,uint256 id){
        require(tasks[addr][id].isCompleted==false,"Task is Completed");
        _;
    }
    function createTask(string calldata _title,string[] calldata imgs,uint256 _targetVotes) public {
    Task storage task = tasks[msg.sender].push();
        task.title = _title;
        task.targetVotes = _targetVotes;
        task.isCompleted = false;
        for(uint256 i = 0; i < imgs.length; i++){
            task.img.push(Image(0, imgs[i]));
        }
        allTasks.push(AllTasks(_title,msg.sender,tasks[msg.sender].length-1));
    }
    function voteTaskImg(address addr,uint256 id,uint256 _imgId) public taskNotCompleted(addr,id){
        require(id<tasks[addr].length,"Not valid task id");
        require(_imgId<tasks[addr][id].img.length,"Not valid");
        require(tasks[addr][id].targetVotes>0,"This task is already completed");
        require(votedByUser[msg.sender][addr][id]==false,"You have already voted");
        tasks[addr][id].img[_imgId].votes++;
        tasks[addr][id].targetVotes--;
        if(tasks[addr][id].targetVotes==0){
            tasks[addr][id].isCompleted=true;
            
        }
        votedByUser[msg.sender][addr][id]=true;

    }

    function getWinner(address addr, uint256 id) public view returns(string memory cid){
        require(tasks[addr][id].isCompleted==true,"Task not completed yet");
        Image[] memory imges=tasks[addr][id].img;
        uint256 maxVotes=0;
        uint256 winningImg=0;
        for(uint256 i=0; i<imges.length; i++){
            if(imges[i].votes>maxVotes){
                maxVotes=imges[i].votes;
                winningImg=i;
            }
        }
        return imges[winningImg].cid;
    }
     function getYourTasks() public view returns(Task[] memory){
        require(tasks[msg.sender].length>0 ,"You have not created any tasks to do");
        return tasks[msg.sender];
     }
    function getAllTasks() public view returns(AllTasks[] memory){
        return allTasks;
    }
    function isCompleted(address addr,uint256 id) public view returns (bool){
        require(id<tasks[addr].length,"Not valid task id");

        return tasks[addr][id].isCompleted;
    }

    function getSpecificTask(address addr,uint256 _id) public view returns(Task memory){
        require(_id<tasks[addr].length,"Not valid task id");

        return tasks[addr][_id];
    }


    
}