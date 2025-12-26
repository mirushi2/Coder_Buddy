<div align="center">

# 🛠️ Coder Buddy  
### Your AI-Powered Coding Teammate 🤖

**An AI-powered coding assistant built using LangGraph**  
that transforms natural language ideas into complete, working projects — just like a real dev team.

</div>

---

## 🌟 About Coder Buddy

**Coder Buddy** behaves like a **virtual multi-agent software development team**.  
You describe what you want to build, and it handles planning, architecture, and implementation — file by file.

🚀 Key Highlights:
- Accepts **natural language prompts**
- Uses **agent-based workflows**
- Writes code directly into project files
- Follows real-world developer practices

Ideal for:
- Rapid prototyping  
- Learning system design & agent workflows  
- Automating repetitive project setup  

---

## 🧠 Architecture

Coder Buddy is built on **LangGraph** and follows a **multi-agent architecture**:

### 🔹 Planner Agent
- Analyzes the user request  
- Creates a structured project plan  

### 🔹 Architect Agent
- Converts the plan into engineering tasks  
- Decides file structure and responsibilities  

### 🔹 Coder Agent
- Implements each task  
- Writes code directly into files  
- Uses tools like a real developer  

<img width="3840" height="448" alt="coder_buddy_diagram" src="https://github.com/user-attachments/assets/f7d238ca-1a05-41ed-8ba0-7caaec17b393" />


---
## 🛠️ Tech Stack

### **Programming & Scripting**
[![Skills](https://skillicons.dev/icons?i=python,js,html,css)](https://skillicons.dev)

### **Frameworks & Libraries**
[![Skills](https://skillicons.dev/icons?i=streamlit)](https://skillicons.dev)
**Streamlit**

### **AI & Agent Frameworks**
[![Skills](https://skillicons.dev/icons?i=ai,py)](https://skillicons.dev)  
🧠 **LangGraph**, **LangChain**, **Groq API**

---

## 🚀 Getting Started

### ✅ Prerequisites

- Install **uv**  
  👉 https://docs.astral.sh/uv/getting-started/installation/
- Create a **Groq account** and generate an API key  
  👉 https://console.groq.com/keys

---

### ⚙️ Installation & Setup

1. Create and activate a virtual environment:
   ```bash
   uv venv
   source .venv/bin/activate
2. Install the dependencies using:
  `uv pip install -r pyproject.toml`
3. Create a `.env` file and add the variables and their respective values mentioned in the `.sample_env` file

Now that we are done with all the set-up & installation steps we can start the application using the following command:
  ```bash
    python main.py
  ```

### 🧪 Example Prompts

- Create a to-do list application using html, css, and javascript.
- Create a simple calculator web application.
- Create a simple blog API in FastAPI with a SQLite database.

---
