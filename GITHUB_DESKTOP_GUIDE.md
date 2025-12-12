# GitHub Desktop Workflow Guide

This guide explains how to make changes to your project and push them to GitHub using GitHub Desktop.

## Prerequisites

✅ You have already:
- Pushed code to GitHub
- Installed GitHub Desktop
- Opened the project folder in GitHub Desktop

## Step-by-Step Workflow

### 1. **Making Changes to Your Project**

#### Option A: Edit Files Directly
1. Open any file in your project (e.g., `public/index.html`, `public/style.css`, `public/script.js`)
2. Make your changes using any text editor (VS Code, Notepad++, etc.)
3. Save the file

#### Option B: Edit Files in VS Code
1. Right-click on your project folder
2. Select "Open with Code" (if you have VS Code installed)
3. Make your changes
4. Save the files (Ctrl+S)

### 2. **Viewing Changes in GitHub Desktop**

After saving your changes:
1. Open **GitHub Desktop**
2. You should see your changes appear in the left panel under **"Changes"**
3. The changes will show:
   - **Modified files** (in yellow/orange)
   - **New files** (in green)
   - **Deleted files** (in red)

### 3. **Staging Changes**

1. In GitHub Desktop, you'll see a list of changed files
2. **To stage all changes:**
   - Check the box next to each file you want to commit, OR
   - Click the checkbox at the top to select all files

3. **To stage specific files:**
   - Check only the files you want to include in this commit
   - Uncheck files you want to save for later

### 4. **Writing a Commit Message**

1. At the bottom of GitHub Desktop, you'll see a text box labeled **"Summary"**
2. Write a brief description of your changes, for example:
   - `"Update button styling"`
   - `"Add new feature for image preview"`
   - `"Fix bug in API call"`
   - `"Update README with new instructions"`

3. **(Optional)** Add a more detailed description in the **"Description"** field below

### 5. **Committing Changes**

1. Click the **"Commit to main"** button (or "Commit to [branch-name]" if you're on a different branch)
2. Your changes are now committed **locally** (saved to your local Git repository)
3. The changes are NOT yet on GitHub - you need to push them

### 6. **Pushing to GitHub**

1. After committing, you'll see a button that says **"Push origin"** or **"Push [number] commits to origin/main"**
2. Click this button
3. GitHub Desktop will upload your changes to GitHub
4. You'll see a progress indicator
5. Once complete, your changes are now on GitHub! 🎉

### 7. **Verifying Your Push**

1. Go to your GitHub repository in a web browser
2. You should see your latest commit at the top
3. Click on the commit to see the changes

---

## Visual Workflow Summary

```
Make Changes → Save Files → Open GitHub Desktop → Stage Changes → 
Write Commit Message → Commit → Push to GitHub → Done! ✅
```

---

## Common Scenarios

### Scenario 1: Making Multiple Small Changes

**Best Practice:** Make related changes together in one commit.

1. Make all your related changes
2. Save all files
3. In GitHub Desktop, stage all related files
4. Write one commit message describing all changes
5. Commit and push

**Example:**
- Changed button color in `style.css`
- Updated button text in `index.html`
- Commit message: `"Update button styling and text"`

### Scenario 2: Making Unrelated Changes

**Best Practice:** Commit unrelated changes separately.

1. Make your first set of changes
2. Save and commit with message: `"Fix API error handling"`
3. Make your second set of changes
4. Save and commit with message: `"Update README documentation"`
5. Push both commits together

### Scenario 3: Undoing Changes

**Before Committing:**
- In GitHub Desktop, right-click on a file
- Select **"Discard changes"** to revert it to the last committed version

**After Committing (but before pushing):**
- Right-click on the commit in the history
- Select **"Undo commit"** (keeps your changes, just removes the commit)

**After Pushing:**
- You'll need to make a new commit to fix it (GitHub Desktop doesn't allow force-pushing easily)

---

## Branching (Advanced)

### Creating a New Branch

1. Click **"Current branch"** dropdown at the top
2. Click **"New branch"**
3. Enter branch name (e.g., `feature-new-design`)
4. Click **"Create branch"**
5. Make your changes and commit as usual
6. When ready, push the branch
7. Create a Pull Request on GitHub to merge it into main

### Switching Branches

1. Click **"Current branch"** dropdown
2. Select the branch you want to switch to
3. GitHub Desktop will update your files automatically

---

## Troubleshooting

### Problem: Changes don't appear in GitHub Desktop

**Solution:**
- Make sure you saved the files
- Refresh GitHub Desktop (close and reopen)
- Check that you're editing files in the correct project folder

### Problem: "Push origin" button is grayed out

**Solution:**
- Make sure you've committed your changes first
- Check your internet connection
- Verify you're logged into GitHub Desktop

### Problem: "Failed to push"

**Solution:**
- Check your internet connection
- Make sure you have permission to push to the repository
- Try pulling first: Click **"Fetch origin"** then **"Pull origin"** if available
- If there are conflicts, GitHub Desktop will help you resolve them

### Problem: Want to sync with latest changes from GitHub

**Solution:**
1. Click **"Fetch origin"** to check for updates
2. If there are updates, click **"Pull origin"** to download them
3. Resolve any conflicts if they occur

---

## Best Practices

1. ✅ **Commit often** - Small, frequent commits are better than large, infrequent ones
2. ✅ **Write clear commit messages** - Describe what changed and why
3. ✅ **Test before pushing** - Make sure your changes work locally
4. ✅ **Pull before pushing** - If working with others, pull latest changes first
5. ✅ **Review changes** - Look at the diff in GitHub Desktop before committing

---

## Quick Reference

| Action | Location in GitHub Desktop |
|--------|---------------------------|
| View changes | Left panel "Changes" |
| Stage files | Checkboxes next to files |
| Commit message | Bottom text box |
| Commit | "Commit to main" button |
| Push | "Push origin" button |
| Pull updates | "Pull origin" button |
| Switch branch | "Current branch" dropdown |
| View history | "History" tab |

---

## Need Help?

- **GitHub Desktop Documentation:** https://docs.github.com/en/desktop
- **Git Basics:** https://git-scm.com/book/en/v2/Getting-Started-Git-Basics
- **Your Repository:** Check your GitHub repository page for more info

---

**Happy coding! 🚀**


