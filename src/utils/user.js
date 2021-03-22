var userList=[]
const userAdd=({id,user,room})=>
{
  /*   name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()
 */
  //  console.log(id,user,room)
    if(!user || !room)
    {
        return {error:"Please mention all field"}
    }
    const findmatch=userList.find((userIt)=>{
        return userIt.user==user && room==userIt.room
    })

    if(findmatch)
    {
        return {error:"Please try with different user name or room"}
    }
    const users={id,user,room}
    userList.push(users)
    return {users}
}

const remove=(id)=>
{
    const Index=userList.findIndex((user)=>user.id==id)
   // console.log(Index)
    if(Index!=-1)
    {
        return userList.splice(Index,1)[0]
    }

}

const getUser=(id)=>
{
 const userobj=userList.find((user)=>user.id==id)
 return userobj
}
const getUsersInRoom=(room)=>
{
    const userListRoom=userList.filter((user)=>user.room==room)
    return userListRoom
}
/* userAdd({id:1,name:'rahul',room:'roy'})
userAdd({id:2,name:'raqhul',room:'rqoy'})
userAdd({id:3,name:'rahul2',room:'roy'})

//console.log(remove(2))
console.log(userList)

console.log(getUser(2))
console.log(getUsersInRoom('roy')) */

module.exports={
    userAdd,
    remove,
    getUser,
    getUsersInRoom
}