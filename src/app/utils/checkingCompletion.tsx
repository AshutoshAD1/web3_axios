export const checkTaskCompletion = async (contract:any,taskCreator: string, taskId: number) => {
  if (contract) {
    const isCompleted = await contract.isCompleted(taskCreator, taskId);
    return isCompleted
    // setCompletedTasks(prevState => new Map(prevState).set(taskId, isCompleted));
    // setCompletedTasks(new Map(completedTasks.set(taskId,isCompleted)))
    // console.log(completedTasks)
  }
}
