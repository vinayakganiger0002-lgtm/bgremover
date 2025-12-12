# Git Setup Instructions

Git is not currently installed on your system. Follow these steps to set up Git and make your initial commit.

## Step 1: Install Git

1. Download Git for Windows from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/PowerShell after installation

## Step 2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Initialize Repository and Commit

Navigate to the project directory and run:

```bash
cd project
git init
git add .
git commit -m "Initial commit: Instant Background Remover web application with API integration"
```

## Step 4: (Optional) Connect to Remote Repository

If you want to push to GitHub:

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## ⚠️ Security Note

**IMPORTANT**: Your `script.js` file contains an API key. If you're pushing to a public repository:

1. **Option 1**: Remove the API key before committing and use environment variables
2. **Option 2**: Add `public/script.js` to `.gitignore` and commit a template version
3. **Option 3**: Use a private repository

To exclude script.js from git:
1. Uncomment the line in `.gitignore`: `# public/script.js` → `public/script.js`
2. Create `public/script.js.template` with placeholder: `const API_KEY = 'YOUR_API_KEY_HERE';`
3. Commit the template instead

