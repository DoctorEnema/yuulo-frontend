import { utilService } from '../services/util-service.js';
import { storageService } from '../services/async-storage-service.js';
import { httpService } from '../services/http-service'




const usersJson = [
    {
        "_id": "u105",
        "fullname": "Liran Barzilay",
        "username": "abi@ababmi.com",
        "password": "aBambi123",
        "imgUrl": "https://ca.slack-edge.com/T01RYA29LLB-U01SE0KL7RQ-c4725a6539f2-72",
        "mentions": [{
            "id": "m101",
            "userId": "m101",
            "taskId": "t101"
        }]
    },
    {
        "_id": "u106",
        "fullname": "Meidan Yona",
        "username": "Mosh@Mosh.com",
        "password": "mosh123",
        "imgUrl": "https://trello-members.s3.amazonaws.com/60e75346a139822337c8c5ad/da3326afdf656a4aed9ae1f46db124b3/original.png",
        "mentions": [{
            "id": "m102",
            "userId": "m102",
            "taskId": "t102"
        }]
    },
    {
        "_id": "u107",
        "fullname": "Sahar Davidyan",
        "username": "Mosh@Mosh.com",
        "password": "mosh123",
        "imgUrl": "https://trello-members.s3.amazonaws.com/5e5ad6ca4e7adc4a3b8cf9db/1480e469745bf6bac3f0b7ab6013f318/original.png",
        "mentions": [{
            "id": "m102",
            "userId": "m102",
            "taskId": "t102"
        }]
    },
]


const USER_KEY = 'user';
// const gUsers = _createUsers();



export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    updateUserNotifications,
    clearNotifications,
    markRead
}

// window.userService = userService
// Note: due to async, must run one by one...
// userService.signup({fullname: 'Puki Norma', username: 'user1', password:'123',score: 100, isAdmin: false})
// userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 100, isAdmin: true})
// userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 100})

async function login(userCred) {
    // const users = await storageService.query('user')
    // const user = users.find(user => user.username === userCred.username)
    // return _saveLocalUser(user)

    const user = await httpService.post('auth/login', userCred)
    if (user) return _saveLocalUser(user)
}
async function signup(userCred) {
    console.log("userCred", userCred)
    // const user = await storageService.post('user', userCred)
    const user = await httpService.post('auth/signup', userCred)
    return _saveLocalUser(user)
}
async function logout() {
    sessionStorage.clear()
    return await httpService.post('auth/logout')
}
function _createUsers() {
    let users = utilService.loadFromStorage(USER_KEY);
    if (!users || !users.length) {
        users = usersJson;

        utilService.saveToStorage(USER_KEY, users);
    }
    return users;
}

function getUsers() {
    // return storageService.query('user')
    return httpService.get(`user`)
}

function getById(userId) {
    // return storageService.get('user', userId)
    return httpService.get(`user/${userId}`)
}
function remove(userId) {
    // return storageService.remove('user', userId)
    return httpService.delete(`user/${userId}`)
}

async function update(user) {
    // return storageService.put('user', user)
    return await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
    // else return savedUser
}


function _saveLocalUser(user) {
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem('loggedinUser') || 'null')
}

async function updateUserNotifications(data) {
    try {
        const user = await getById(data.userId)
        if (!user.notifications) user.notifications = []
        user.notifications.unshift(data.fullActivity)
        const savedUser = await update(user)
        return savedUser
        // console.log(savedUser);
    } catch (err) {
        console.log('cannot update notification', err);
    }
}

async function clearNotifications(userId) {
    try {
        const user = await getById(userId)
        // console.log(user);
        user.notifications = []
        const savedUser = await update(user)
        return savedUser
    } catch (err) {
        console.log('cannot update notification', err);
    }
}
async function markRead(userId) {
    try {
        const user = await getById(userId)
        user.notifications.forEach(n => n.isRead = true)
        // console.log('notifications',user.notifications);
        const savedUser = await update(user)
        return savedUser
    } catch (err) {
        console.log('cannot update notification', err);
    }
}

