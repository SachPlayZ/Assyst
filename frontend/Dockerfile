# Use an official Node runtime as the base image
# Using the alpine version for a smaller image size
FROM node:23

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
# The --no-cache flag helps keep the image small
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

ENV REACT_APP_GOOGLE_CLIENT_ID="361149494731-7i3cvioq8qv299l9jc8f0i1j8sk4ovta.apps.googleusercontent.com"
# Build the React application for production
RUN npm run build

# Install a lightweight static server to serve the production build
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000


# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]