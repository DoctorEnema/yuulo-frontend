import { userService } from '../../services/user-service'
// import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_USER_UPDATED } from '../services/socket.service'

// var localLoggedinUser = null;
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null);

export const userStore = {
    state: {
        loggedinUser: userService.getLoggedinUser(),
        users: [],
        watchedUser: null,
    },
    getters: {
        users(state) { 
            return state.users 
        },
        loggedinUser({ loggedinUser }) { return loggedinUser },
        watchedUser({ watchedUser }) { return watchedUser },
        user({ user }) { return user }
    },
    mutations: {
        setLoggedinUser(state, { user }) {
            state.loggedinUser = user;
        },
        setLoggedinUser(state, { user }) {
            state.loggedinUser = user;
        },
        setWatchedUser(state, { user }) {
            state.watchedUser = user;
        },       
        setUsers(state, { users }) {
            state.users = users;
        },
        // setUser(state, { user }) {
        //     state.user = user;
        // },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId)
        },
        setNotification(state, {activity}) {
            state.loggedinUser.notifications.unshift(activity);
        }
    },
    actions: {
        async login({ commit }, { userCred }) {
            try {
                const user = await userService.login(userCred);
                commit({ type: 'setLoggedinUser', user })
                return user;
            } catch (err) {
                console.log('userStore: Error in login', err)
                throw err
            }
        },
        async signup({ commit }, { userCred }) {
            try {
                const user = await userService.signup(userCred)
                commit({ type: 'setLoggedinUser', user })
                return user;
            } catch (err) {
                console.log('userStore: Error in signup', err)
                throw err
            }

        },
        async logout({ commit }) {
            try {
                await userService.logout()
                commit({ type: 'setLoggedinUser', user: null })
            } catch (err) {
                console.log('userStore: Error in logout', err)
                throw err
            }
        },
        async loadUsers({ commit }) {
            try {
                const users = await userService.getUsers();
                commit({ type: 'setUsers', users })
            } catch (err) {
                console.log('userStore: Error in loadUsers', err)
                throw err
            }
        },        
        // async loadAndWatchUser({ commit }, { userId }) {
        //     try {
        //         const user = await userService.getById(userId);
        //         commit({ type: 'setWatchedUser', user })
        //         socketService.emit(SOCKET_EMIT_USER_WATCH, userId) 
        //         socketService.off(SOCKET_EVENT_USER_UPDATED)
        //         socketService.on(SOCKET_EVENT_USER_UPDATED, user => {
        //             commit({ type: 'setWatchedUser', user })
        //         })
        //     } catch (err) {
        //         console.log('userStore: Error in loadAndWatchUser', err)
        //         throw err
        //     }
        // },
        
        async loadUserCardWatch({ commit }, { userId }) {
            try {
                const user = await userService.getById(userId);
                // commit({ type: 'setUser', user })
                socketService.emit("user-watch", userId);
                socketService.off('notifyMemberActivity')
                socketService.on('notifyMemberActivity', activity => {
                    commit({ type: 'setNotification', activity })
                })
            } catch (err) {
                console.log('userStore: Error in loadAndWatchUser', err)
                throw err
            }
        },

        async removeUser({ commit }, { userId }) {
            try {
                await userService.remove(userId);
                commit({ type: 'removeUser', userId })
            } catch (err) {
                console.log('userStore: Error in removeUser', err)
                throw err
            }
        },
        async updateUser({ commit }, { user }) {
            try {
                const updatedUser = await userService.update(user);
                console.log('updatedUser',updatedUser);
                commit({ type: 'setLoggedinUser', user:updatedUser })
                
            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }
        },
        async updateUserNotifications({ commit }, { data }) {
            try {
                // const user = await userService.getById(data.userId)
                await userService.updateUserNotifications(data)
            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }
        },
        async clearNotifications({commit}, {userId}) {
            try{
                const user = await userService.clearNotifications(userId)
                // console.log('user',user);
                commit({ type: 'setLoggedinUser', user })
            } catch (err) {
                console.log('cannot clear notifications');
            }
        },
        async markRead({commit}, {userId}) {
            try{
                const user = await userService.markRead(userId)
                // console.log('user',user);
                commit({ type: 'setLoggedinUser', user })
            } catch (err) {
                console.log('cannot clear notifications');
            }
        }

    }
}