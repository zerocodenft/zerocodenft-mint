import { MerkleTree } from 'merkletreejs'
import { ethers } from 'ethers'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'

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

const copyToClipboard = async function(value) {
    await navigator.clipboard.writeText(value)
    this.$bvToast.toast('Copied to clipboard!', {
        title: 'Clipboard',
        variant: 'info',
    })
}

const getProvider = (chainId, isStatic = true) => {
    const providerUrl = CHAINID_CONFIG_MAP[chainId.toString()].rpcUrls[0]
    return isStatic
        ? new ethers.providers.StaticJsonRpcProvider(providerUrl)
        : new ethers.providers.JsonRpcProvider(providerUrl)
}

const wait = (delay) => {
	return new Promise((resolve) => setTimeout(resolve, delay))
}

export {
	getMerkeTree,
	getHexProof,
	checkWhitelisted,
	copyToClipboard,
	getProvider,
    wait
}