// Define global variables
let web3;
let contract;
const ipfs = window.IpfsHttpClient({ host: 'localhost', port: 5001, protocol: 'http' });

async function displayNFT(tokenId) {
    try {
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        const metadataURI = tokenURI.replace(/^ipfs:\/\//, '');
        const response = await fetch(`http://localhost:8080/ipfs/${metadataURI}`);
        console.log('Metadata URI:', metadataURI);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const metadata = await response.json();

        // Create image element
        const nftImage = document.createElement('img');
        const metadataImageCid = metadata.image.replace(/^ipfs:\/\//, '');
        const imageSrc = `http://localhost:8080/ipfs/${metadataImageCid}`;
        nftImage.src = imageSrc;
        nftImage.alt = "NFT Image";

        // Create container for each NFT
        const nftContainer = document.createElement('div');
        nftContainer.className = 'nft-container'; // Add a class for styling
        nftContainer.appendChild(nftImage);

        // Create and append token ID
        const tokenIdElement = document.createElement('p');
        tokenIdElement.textContent = `Token ID: ${tokenId}`;
        nftContainer.appendChild(tokenIdElement);

        // Create and append name if it exists
        if(metadata.name) {
            const nameElement = document.createElement('p');
            nameElement.textContent = `Name: ${metadata.name}`;
            nftContainer.appendChild(nameElement);
        }

        // Create and append description if it exists
        if(metadata.description) {
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = `Description: ${metadata.description}`;
            nftContainer.appendChild(descriptionElement);
        }

        // Append the container to the display area
        document.getElementById('nft-display-container').appendChild(nftContainer);

    } catch (error) {
        console.error('Error displaying NFT:', error);
    }
}


// Initialize the contract with ABI and address
function initializeContract() {

    const abi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "symbol",
                    "type": "string"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "ERC721EnumerableForbiddenBatchMint",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721IncorrectOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721InsufficientApproval",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidApprover",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOperator",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidReceiver",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidSender",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721NonexistentToken",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "ERC721OutOfBoundsIndex",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "uri",
                    "type": "string"
                }
            ],
            "name": "mint",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "OwnableInvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "baseURI_",
                    "type": "string"
                }
            ],
            "name": "setBaseURI",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "newURI",
                    "type": "string"
                }
            ],
            "name": "updateTokenURI",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "tokenByIndex",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "tokenOfOwnerByIndex",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]; // Replace with your contract's ABI
    const contractAddress = '0xaac7d6bbd3554a92f1f94e5fb26e84c259aedc34'; // Replace with your contract's address

    contract = new web3.eth.Contract(abi, contractAddress);

}

window.initializeContract = initializeContract;

// Upload and Mint Button
const uploadAndMintButton = document.getElementById('uploadAndMintButton');

if (uploadAndMintButton) {
    uploadAndMintButton.addEventListener('click', async () => {
        if (!web3) {
            console.error('Web3 is not initialized.');
            return;
        }

        const nftName = document.getElementById('nftName').value;
        const nftDescription = document.getElementById('nftDescription').value;
        const nftImageInput = document.getElementById('nftImage');

        if (!nftName || !nftDescription || !nftImageInput.files[0]) {
            console.error('Please provide NFT name, description, and image.');
            return;
        }

        try {
            const imageBuffer = await nftImageInput.files[0].arrayBuffer();
            const imageCIDGenerator = await ipfs.add(imageBuffer);

            let imageCID;
            for await (const result of imageCIDGenerator) {
                imageCID = result.path;
                break;
            }

            const metadata = {
                name: nftName,
                description: nftDescription,
                image: `ipfs://${imageCID}`,
            };

            const metadataCIDGenerator = await ipfs.add(JSON.stringify(metadata));

            let metadataCID;
            for await (const result of metadataCIDGenerator) {
                metadataCID = result.path;
                break;
            }

            const accounts = await web3.eth.getAccounts();
            const senderAddress = accounts[0];

            const mintResult = await contract.methods.mint(senderAddress, `ipfs://${metadataCID}`).send({
                from: senderAddress,
            });

            console.log('NFT Minted successfully!');
            const tokenId = mintResult.events.Transfer.returnValues.tokenId;
            displayNFT(tokenId);
        } catch (error) {
            console.error('Error minting NFT:', error);
        }
    });
}


// Displaying minted NFTs
const displayNFTsButton = document.getElementById('displayNFTsButton');

if (displayNFTsButton) {
    displayNFTsButton.addEventListener('click', async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const ownerAddress = accounts[0];
        //console.log('Address: ', ownerAddress);
        const balance = await contract.methods.balanceOf(ownerAddress).call();
        //console.log('Balance:', balance); // Add this line to check the balance


        // Clear the existing NFT display
        const nftDisplayContainer = document.getElementById('nft-display-container');
        nftDisplayContainer.innerHTML = '';

        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(ownerAddress, i).call();
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            const metadataURI = tokenURI.replace(/^ipfs:\/\//, '');
            const response = await fetch(`http://localhost:8080/ipfs/${metadataURI}`);
            const metadata = await response.json();

            // Log metadata.image here
            //console.log('metadata.image:', metadata.image);
            const metadataImageCid = metadata.image.replace(/^ipfs:\/\//, '');
            const imageSrc = `http://localhost:8080/ipfs/${metadataImageCid}`;
            

            const nftImage = document.createElement('img');
            nftImage.src = imageSrc;
            nftImage.alt = "NFT Image";

            // Create a div for NFT information
            const nftInfo = document.createElement('div');
            nftInfo.innerHTML = `<p><strong>Name:</strong> ${metadata.name}</p><p><strong>Description:</strong> ${metadata.description}</p>`;

            // Create a container div for each NFT
            const nftContainer = document.createElement('div');
            nftContainer.appendChild(nftImage);
            nftContainer.appendChild(nftInfo);

            nftDisplayContainer.appendChild(nftContainer);
        }
    } catch (error) {
        console.error('Error displaying NFTs:', error);
        }
    });
}

// Updating NFT token URI
const updateTokenButton = document.getElementById('updateTokenButton');

if (updateTokenButton) {
    updateTokenButton.addEventListener('click', async () => {
    const tokenId = document.getElementById('updateTokenId').value;
    const nftName = document.getElementById('newNftName').value;
    const nftDescription = document.getElementById('newNftDescription').value;
    const nftImageInput = document.getElementById('newNftImage');

    if (!nftName || !nftDescription || !nftImageInput.files[0]) {
        console.error('Please provide new NFT name, description, and image.');
        return;
    }

    try {
        const imageBuffer = await nftImageInput.files[0].arrayBuffer();
        const imageCIDGenerator = await ipfs.add(imageBuffer);

        let imageCID;
        for await (const result of imageCIDGenerator) {
            imageCID = result.path;
            break;
        }

        const newMetadata = {
            name: nftName,
            description: nftDescription,
            image: `ipfs://${imageCID}`,
        };

        const metadataCIDGenerator = await ipfs.add(JSON.stringify(newMetadata));
        let metadataCID;
        for await (const result of metadataCIDGenerator) {
            metadataCID = result.path;
            break;
        }

        const newTokenURI = `ipfs://${metadataCID}`;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.updateTokenURI(tokenId, newTokenURI).send({ from: accounts[0] });
        console.log(`NFT ${tokenId} updated successfully!`);
    } catch (error) {
        console.error('Error updating NFT:', error);
        }
    });
}

// Burning (deleting) an NFT
const burnTokenButton = document.getElementById('burnTokenButton');

if (burnTokenButton) {
    burnTokenButton.addEventListener('click', async () => {
    const tokenId = document.getElementById('burnTokenId').value;

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.burn(tokenId).send({ from: accounts[0] });
        console.log(`NFT ${tokenId} burned successfully!`);
    } catch (error) {
        console.error('Error burning NFT:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    loadNavbar();  // Load the navbar on each page
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);

        // Check if there's a wallet address in the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const storedAddress = urlParams.get('walletAddress') || localStorage.getItem('walletAddress');

        if (storedAddress) {
            console.log('Stored address found:', storedAddress);
            updateWalletButtonText(storedAddress);  // Update button text
            initializeContract();
            if (window.location.pathname.endsWith('all-nfts.html')) {
                displayAllNFTs();
            }
        } else {
            console.log('Wallet not connected. Please connect your wallet.');
            // Optionally, you can set the button text to 'Connect Wallet' here
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});


// Ensure this function is accessible in app.js or in a script loaded by every page
function updateWalletButtonText(address) {
    const walletButton = document.getElementById('connectWalletButton');
    if (walletButton) {
        console.log('Updating wallet button text to:', address);
        walletButton.innerText = `Wallet Connected: ${address}`;

        // Update the URL with the wallet address as a query parameter
        const newURL = new URL(window.location.href);
        newURL.searchParams.set('walletAddress', address);
        window.history.replaceState({}, document.title, newURL);
    }
}

async function displayAllNFTs() {
    if (!web3 || !contract) {
        console.error('Web3 or contract not initialized.');
        return;
    }

    try {
        const totalSupply = await contract.methods.totalSupply().call();
        console.log(`Total Supply: ${totalSupply}`);
        
        for (let i = 0; i < totalSupply; i++) {
            const tokenId = await contract.methods.tokenByIndex(i).call();
            console.log(`Displaying Token ID: ${tokenId}`);
            displayNFT(tokenId);
        }
    } catch (error) {
        console.error('Error fetching all NFTs:', error);
    }
}
