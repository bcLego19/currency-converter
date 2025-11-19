# Step 1: Use a lightweight web server as the base image
# Nginx is the industry standard for serving static HTML files
FROM nginx:alpine

# Step 2: Copy our project file into the container
# We take 'index.html' from our computer and put it in the folder
# where Nginx expects to find files to serve.
COPY index.html /usr/share/nginx/html/index.html

# Step 3: Document which port the container listens on
# Nginx defaults to port 80
EXPOSE 80