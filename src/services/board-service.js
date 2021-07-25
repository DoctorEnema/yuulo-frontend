import { utilService } from '../services/util-service.js';
import { storageService } from '../services/async-storage-service.js';
import { httpService } from '../services/http-service.js';

// const user = {
//     "_id": "u101",
//     "fullname": "Abi Abambi",
//     "username": "abi@ababmi.com",
//     "password": "aBambi123",
//     "imgUrl": "http://some-img.jpg",
//     "mentions": [{
//         "id": "m101",
//         "boardId": "m101",
//         "taskId": "t101"
//     }]
// }


const BOARD_KEY = 'boards';
// const gBoards = _createBoards();

export const boardService = {
    query,
    remove,
    getById,
    saveBoard,
    removeGroup,
    addGroup,
    removeCard,
    addCard,
    updateCard,
    getCardById,
    getEmptyTodo,
    getEmptyList,
    updateLabel,
    updateGroup,
    removeMember
};



function _createBoards() {
    let boards = utilService.loadFromStorage(BOARD_KEY);
    if (!boards || !boards.length) {
        boards = newBoard;

        utilService.saveToStorage(BOARD_KEY, boards);
    }
    return boards;
}

// function query() {
//     return storageService.query(BOARD_KEY);
// }
async function query() {
    return httpService.get('board')
}

// function remove(boardId) {
//     return storageService.remove(BOARD_KEY, boardId)
// }
function remove(boardId) {
    return httpService.delete(`board/${boardId}`)
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`)
    // return storageService.get(BOARD_KEY, boardId);
}

// function addBoard(board) {
//     return storageService.post(BOARD_KEY, board)

// }

function saveBoard(board) {
    if (board._id) return httpService.put('board', board)
    else return httpService.post('board', board)
    // return storageService.put(BOARD_KEY, board)
}

function removeGroup(board, groupId) {
    const idx = board.groups.findIndex(group => groupId === group.id)
    board.groups.splice(idx, 1)
    return saveBoard(board)
}

function addGroup(board, group) {
    group.id = utilService.makeId()
    board.groups.push(group)
    return saveBoard(board)
}

function updateGroup(board, group) {
    const groupIdx = board.groups.findIndex(g => g.id === group.id)
    board.groups.splice(groupIdx, 1, group)
    return saveBoard(board)
}

function removeCard(board, group, cardId) {
    const cardIdx = group.cards.findIndex(card => cardId === card.id)
    group.cards.splice(cardIdx, 1)
    const grIdx = board.groups.findIndex(gr => gr.id === group.id)
    board.groups.splice(grIdx, 1, group)
    return saveBoard(board)
}

function updateCard(board, group, cardId, newCard) {
    const cardIdx = group.cards.findIndex(card => cardId === card.id)
    group.cards.splice(cardIdx, 1, newCard)
    const grIdx = board.groups.findIndex(gr => gr.id === group.id)
    board.groups.splice(grIdx, 1, group)
    return saveBoard(board)
}

function addCard(board, groupId, card) {
    card.id = utilService.makeId()
    const idx = board.groups.findIndex(group => groupId === group.id)
    if (!board.groups[idx].cards) board.groups[idx].cards = []
    board.groups[idx].cards.push(card)
    return saveBoard(board)
}

async function getCardById(cardId, groupId, boardId) {
    try {
        const board = await getById(boardId)
        const groupIdx = board.groups.findIndex(group => group.id === groupId)
        const cardIdx = board.groups[groupIdx].cards.findIndex(card => card.id === cardId)
        return { card: board.groups[groupIdx].cards[cardIdx], group: board.groups[groupIdx], board: board }
    } catch (err) {
        console.log('cannot get card', err);
    }
}

function updateLabel(board, action, pickedLabel) {
    if (!board.labels) board.labels = []
    if (action === 'add') {
        board.labels.push(pickedLabel)
    } else if (action === 'remove') {
        const labelIdx = board.labels.findIndex(label => label.id === pickedLabel.id)
        board.labels.splice(labelIdx, 1)
        board.groups.forEach(group => {
            group.cards.forEach(card => {
                if (card.labelIds) {
                    const idIdx = card.labelIds.findIndex(id => id === pickedLabel.id)
                    if (idIdx !== -1) {
                        card.labelIds.splice(idIdx, 1)
                    }
                }
            })
        })
    } else if (action === 'update') {
        const labelIdx = board.labels.findIndex(label => label.id === pickedLabel.id)
        if (labelIdx !== -1) board.labels.splice(labelIdx, 1, pickedLabel)
    }
    return saveBoard(board)
}

function removeMember(board,memberId){
    const memberIdx = board.members.findIndex(m => m._id === memberId)
    board.members.splice(memberIdx,1)
    board.groups.forEach(group => {
        group.cards.forEach(card => {
            if (card.members) {
                const idIdx = card.members.findIndex(member => member._id === memberId)
                if (idIdx !== -1) {
                    card.members.splice(idIdx, 1)
                }
            }
        })
    })
    return saveBoard(board)
}

function getEmptyTodo() {
    return {
        id: utilService.makeId(),
        title: '',
        isDone: false,
        isEdit: false
    }
}

function getEmptyList() {
    return {
        id: utilService.makeId(),
        title: '',
        todos: []
    }
}