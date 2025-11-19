# Currency Splitter Project

This project demonstrates a JavaScript-based currency allocation tool running inside a Docker container.

---

## 📌 Logic Overview

### **Input**
User sets a global budget (USD).

### **Allocation**
User inputs a sub-amount to convert to a specific currency (e.g., JPY, INR).

### **Validation**
The app calculates the sum of all current allocations using a `for` loop.  
If **new amount + current sum > total budget**, the app blocks the action.

### **API**
Fetches live exchange rates from **api.exchangerate-api.com**.

---

## 🚀 How to Run with Docker

### **1. Build the Image**
Run this command in the same folder as your project files.  
This creates a “blueprint” (Docker image) for your app:

```bash
docker build -t currency-splitter .
```

#### Command Breakdown:

* `docker build`: The command to create an image.

* `-t currency-splitter`: Tags (names) the image "currency-splitter".

* `.`: Tells Docker to look for the Dockerfile in the current directory.

### **2. Run the Container**

Once the image is built, you can run it as a container.

```bash
docker run -d -p 8080:80 currency-splitter
```

#### Command Breakdown:

* `docker run`: Starts a container.

* `-d`: Detached mode (runs in the background).

* `-p 8080:80`: Map port 8080 on your computer to port 80 inside the container.

### **3. View the App**

Open your web browser and go to:

👉 http://localhost:8080