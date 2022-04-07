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

const getHexProof = (list, address) => {
	const merkleTree = getMerkeTree(list)
	return merkleTree.getHexProof(ethers.utils.keccak256(address))
}

const checkWhitelisted = (list, address) => {
	const merkleTree = getMerkeTree(list)
	const hexProof = merkleTree.getHexProof(ethers.utils.keccak256(address))
	return merkleTree.verify(hexProof, ethers.utils.keccak256(address), merkleTree.getRoot())
}

export {
    SALE_STATUS,
	getMerkeTree,
	getHexProof,
	checkWhitelisted
}