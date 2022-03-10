import { MerkleTree } from 'merkletreejs'
import { ethers } from 'ethers'

const SALE_STATUS = Object.freeze({
	Paused: 0,
	Presale: 1,
	Public: 2,
})

const getMerkeTree = (whitelist) => {
    const leafNodes = whitelist.map(a => ethers.utils.keccak256(a))
    return new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true })
}

export {
    SALE_STATUS,
	getMerkeTree
}