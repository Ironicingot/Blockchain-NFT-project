// Function to load the navbar and initialize related functionality
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            if (navbarPlaceholder) {
                navbarPlaceholder.innerHTML = data;
                initWalletButton();
                // Any other initialization that depends on the navbar
            }
        });
}

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
    if (walletButton) {
        walletButton.addEventListener('click', async () => {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    await ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Ethereum successfully detected!');
                    initializeContract();
                    walletButton.innerText = 'Wallet Connected';
                } catch (error) {
                    console.error('User denied account access...', error);
                }
            } else {
                console.log('Non-Ethereum browser detected. Consider MetaMask!');
            }
        });
    }

    // Add any other navbar-related initialization here
}

// Call the load functions
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
    // Do not initialize wallet button here, do it inside loadNavbar
});
