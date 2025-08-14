# Backend Server Setup for Document Search

To enable the property document search feature in the dashboard, you must run the PHP backend server that serves the required API endpoints.

## Steps to Start the PHP Backend Server

1. **Ensure PHP is installed**
   - Run `php -v` in your terminal to check if PHP is available.
   - If not installed, download it from [php.net](https://www.php.net/downloads.php) and follow the installation instructions for your OS.

2. **Start the PHP server**
   - Open a terminal in the project root directory.
   - Run the following command:
     
     ```sh
     php -S localhost:8000 -t server/php
     ```
   - This will serve all PHP files in the `server/php` directory on port 8000.

3. **Verify the server is running**
   - Open your browser and go to: [http://localhost:8000/search_documents.php](http://localhost:8000/search_documents.php)
   - You should see a blank page, a JSON response, or an error from your PHP script (not a connection refused error).

4. **Troubleshooting**
   - If you see "connection refused," make sure no other service is using port 8000 and that your firewall/antivirus is not blocking PHP.
   - If you use a different port, update the fetch URL in your React code accordingly.

---

**Note:** The React dashboard will not be able to fetch documents unless this backend server is running. 