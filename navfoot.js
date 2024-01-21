function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            initNavbar();
            initWalletButton(); // Initialize navbar functionality after it's loaded
        });
}

function initNavbar() {
    const burger = document.querySelector('.burger');
    const navbarLinks = document.querySelector('.navbar ul.nav-links');

    if(burger && navbarLinks) { // Check if elements exist
        burger.addEventListener('click', function () {
            navbarLinks.classList.toggle('nav-active');
            this.classList.toggle('toggle');
        });
    } else {
        // Handle error: elements not found
        console.error('Navbar elements not found');
    }
}

document.addEventListener('DOMContentLoaded', loadNavbar);




// Function to load the footer
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
            // Any footer related initialization can go here
        });
}

// Initialize the wallet connection logic
function initWalletButton() {
    const walletButton = document.getElementById('connectWalletButton');
    const disconnectButton = document.getElementById('disconnectWalletButton');

    // Function to reset the button state
    function resetButtonState() {
        walletButton.style.display = 'inline-block'; // Show "Connect Wallet" button
        disconnectButton.style.display = 'none'; // Hide "Disconnect" button
        disconnectButton.innerText = 'Disconnect';
    }

    walletButton.addEventListener('click', async () => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const walletAddress = accounts[0]; // Get the first connected wallet address
                console.log('Ethereum successfully detected!');
                initializeContract();
                walletButton.style.display = 'none'; // Hide "Connect Wallet" button
                disconnectButton.style.display = 'inline-block'; // Show "Disconnect" button
                disconnectButton.innerText = `Disconnect (${walletAddress})`;

                // Store the wallet address in a cookie
                Cookies.set('walletAddress', walletAddress, { expires: 365 }); // Set the cookie to expire in 1 year

                disconnectButton.addEventListener('click', async () => {
                    try {
                        await ethereum.request({ method: 'eth_requestAccounts' });
                        // Clear the wallet address cookie to simulate disconnection
                        Cookies.remove('walletAddress');
                        resetButtonState(); // Reset the button state
                        // You can add further logic for handling disconnection if needed
                    } catch (error) {
                        console.error('User denied account access...', error);
                    }
                });
            } catch (error) {
                console.error('User denied account access...', error);
            }
        } else {
            console.log('Non-Ethereum browser detected. Consider MetaMask!');
        }
    });

    // Check if there is a wallet address stored in a cookie
    const storedWalletAddress = Cookies.get('walletAddress');

    if (storedWalletAddress) {
        // If a wallet address is found in the cookie, automatically connect
        walletButton.style.display = 'none';
        disconnectButton.style.display = 'inline-block';
        disconnectButton.innerText = `Disconnect (${storedWalletAddress})`;
        initializeContract();

        disconnectButton.addEventListener('click', async () => {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' });
                // Clear the wallet address cookie to simulate disconnection
                Cookies.remove('walletAddress');
                resetButtonState(); // Reset the button state
                // You can add further logic for handling disconnection if needed
            } catch (error) {
                console.error('User denied account access...', error);
            }
        });
    }
}

// Call the load functions
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
    // Do not initialize wallet button here, do it inside loadNavbar
});
