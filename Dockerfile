# Step 1: Use a lightweight web server as the base image
FROM nginx:alpine

# Step 2: Copy our HTML file
COPY index.html /usr/share/nginx/html/index.html

# Step 3: Copy our JS file (IMPORTANT: This must be included!)
# The container is an isolated box. If we don't copy the JS file in,
# the HTML will look for it but won't find it.
COPY currency.js /usr/share/nginx/html/currency.js

# Step 4: Expose the port
EXPOSE 80