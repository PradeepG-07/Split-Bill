# :page_facing_up: Split-Bill

## :scroll: Description

Split-Bill is a web application designed to help users split bills and manage expenses among friends or groups. The application allows users to create bills, invite friends, track payments, and settle expenses easily.

## :star: Features

-   **`Create Bills`**: Users can create new bills with details such as total amount, bill name, description, and invitations.
-   **`Invite Friends`**: Users can invite friends to participate in the bill splitting.
-   **`Track Payments`**: Users can track the status of payments and see who has paid and who hasn't.
-   **`Settle Expenses`**: Users can settle expenses and transfer amounts to the bill owner.
-   **`Profile Management`**: Users can update their profile details, change passwords, and upload profile pictures.

## :gear: Installation and Configuration

1. Clone the repository:
    ```bash
    git clone https://github.com/PradeepG-07/split-bill.git
    ```
2. Navigate to the project directory:
    ```bash
    cd split-bill
    ```
3. Navigate to backend and install dependencies:
    ```bash
    cd backend
    npm install
    ```
4. Configure environment variables for backend:
    ```javascript
    PORT=8000
    MONGODB_URL=
    DB_NAME=
    FRONTEND_URI=
    ACCESS_TOKEN_SECRET=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    ```
5. Build and start the backend server:
    ```bash
    npm run build
    npm start
    ```

## :handshake: Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Add new feature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-branch
    ```
5. Create a pull request.

## :rocket: Future Works

-   [ ] **`Implement rate limiting: `** Implement rate limiting with size of 10 responses per request at sending bills.
-   [ ] **`Implement regular expression for finding new user: `** Upon keydown in the frontend, a request should be sent to backend quering for the user with the partial entered username.
-   [ ] **`Avoid multiple uploads of same image: `** Instead of uploading the profile pictures directly, calculate checksums with 5 different algorithms and verify it on cloudinary server whether a file exists with same checksums.

-   [ ] **`Avoid disk writes: `** Instead of storing the file in local file system, directly upload the file to cloudinary using the buffer methods of multer which help to stream the file contents directly.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

