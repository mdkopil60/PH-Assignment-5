// Load Issues from API
async function loadIssues(type) {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data = await res.json()
    let issues = data.data
    if (type === "open") {
        issues = issues.filter(issue => issue.status === "open")
    }
    if (type === "closed") {
        issues = issues.filter(issue => issue.status === "closed")
    }
    displayIssues(issues)
}



// Display Issues Card
function displayIssues(issues) {
    const container = document.getElementById("issuesContainer")
    container.innerHTML = ""
    issues.forEach(issue => {

        const borderColor = issue.status === "open"
            ? "border-green-500"
            : "border-purple-500"

        container.innerHTML += `
    <div onclick="showModal(${issue.id})"
    class="bg-white rounded-lg shadow-md border-t-4 ${borderColor} p-4 cursor-pointer hover:shadow-lg transition">

    <div class="flex justify-between items-center mb-2">

    <span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
    ${issue.priority}
    </span>

    </div>

    <h2 class="font-semibold text-sm mb-1">
    ${issue.title}
    </h2>
    <p class="text-xs text-gray-500 mb-3">
    ${issue.description}
    </p>
    <div class="flex gap-2 mb-3">

    <span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
    ${issue.category}
    </span>

    <span class="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
    ${issue.label}
    </span>

    </div>

    <div class="text-xs text-gray-400">
    #${issue.id} by ${issue.author}  
    <br>
    ${issue.createdAt}
    </div>
    </div>
    `
    })
}


// Modal (Issue Details)
async function showModal(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    const data = await res.json()
    const issue = data.data
    alert(`Title: ${issue.title}
    Description: ${issue.description}
    Category: ${issue.category}
    Author: ${issue.author}
    Priority: ${issue.priority}`)

}
// Search Function
async function searchIssue() {
    const text = document.getElementById("searchInput").value
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
    const data = await res.json()
    displayIssues(data.data)

}

// Page Load
window.onload = () => {
    loadIssues("all")

}
// 
async function showModal(id) {

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    const data = await res.json()
    const issue = data.data

    document.getElementById("modalTitle").innerText = issue.title
    document.getElementById("modalStatus").innerText = issue.status
    document.getElementById("modalAuthor").innerText =
        "Opened by " + issue.author + " • " + issue.createdAt

    document.getElementById("modalCategory").innerText = issue.category
    document.getElementById("modalLabel").innerText = issue.label
    document.getElementById("modalDescription").innerText =
        issue.description
    document.getElementById("modalAssignee").innerText =
        issue.author
    document.getElementById("modalPriority").innerText =
        issue.priority
    document.getElementById("issueModal").showModal()

}