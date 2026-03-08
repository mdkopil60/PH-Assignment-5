async function loadIssues(type) {
    document.getElementById("loadingSpinner").classList.remove("hidden")
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
    document.getElementById("loadingSpinner").classList.add("hidden")
}

// Display Issues Card
function displayIssues(issues) {
    const container = document.getElementById("issuesContainer")
    container.innerHTML = ""
    document.getElementById("issueCount").innerText = issues.length
    issues.forEach(issue => {
        const labels = issue.labels.map(label => {

            let labelColor = "bg-gray-100 text-gray-600"

            if (label === "bug") {
                labelColor = "bg-red-100 text-red-600"
            }
            else if (label === "enhancement") {
                labelColor = "bg-green-100 text-green-600"
            }
            else if (label === "help wanted") {
                labelColor = "bg-yellow-100 text-yellow-600"
            }
            else if (label === "documentation") {
                labelColor = "bg-blue-100 text-blue-600"
            }
            else {
                labelColor = "bg-yellow-100 text-yellow-600"
            }
            return `
            <span class="text-[10px] px-2 py-1 rounded-full ${labelColor}">
            ${label.toUpperCase()}
            </span>
            `
        }).join("")
        document.getElementById("modalLabel").innerHTML = labels
        const borderColor =
            issue.status === "open"
                ? "border-green-500"
                : "border-purple-500"
        const statusIcon =
            issue.status === "open"
                ? "./assets/Open-Status.png"
                : "./assets/Closed- Status .png"
        const priorityColor =
            issue.priority === "high"
                ? "bg-red-100 text-red-600"
                : issue.priority === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600"


        container.innerHTML += `
        
        <div onclick="showModal(${issue.id})"
        class="bg-white rounded-xl shadow-sm border-t-4 ${borderColor} p-4 cursor-pointer hover:shadow-md transition">

            <div class="flex justify-between items-center mb-2">

                <img src="${statusIcon}" class="w-4 h-4">

                <span class="text-[10px] px-2 py-1 rounded-full ${priorityColor}">
                    ${issue.priority.toUpperCase()}
                </span>

            </div>

            <h2 class="font-semibold text-sm mb-1">
                ${issue.title}
            </h2>

            <p class="text-xs text-gray-500 mb-3 line-clamp-2">
                ${issue.description}
            </p>

            <div class="flex gap-2 mb-3 flex-wrap">
                ${labels}
            </div>

            <div class="text-xs text-gray-400">
                #${issue.id} by ${issue.author}
                <br>
                ${new Date(issue.createdAt).toLocaleDateString()}
            </div>

        </div>
        `
    })
}
// Search Function
async function searchIssue() {
    const text = document.getElementById("searchInput").value
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
    const data = await res.json()
    displayIssues(data.data)
}
// Page Load
function changeTab(type) {
    document.getElementById("tab-all").classList.remove("tab-active")
    document.getElementById("tab-open").classList.remove("tab-active")
    document.getElementById("tab-closed").classList.remove("tab-active")
    document.getElementById(`tab-${type}`).classList.add("tab-active")
    loadIssues(type)
}
window.onload = () => {
    changeTab("all")
}
// module show
async function showModal(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    const data = await res.json()
    const issue = data.data
    document.getElementById("modalTitle").innerText = issue.title
    document.getElementById("modalStatus").innerText = issue.status
    document.getElementById("modalAuthor").innerText =
        "Opened by " + issue.author + " • " + new Date(issue.createdAt).toLocaleDateString()
    document.getElementById("modalDescription").innerText = issue.description
    document.getElementById("modalAssignee").innerText = issue.author
    document.getElementById("modalPriority").innerText = issue.priority

    // safe labels
    const labels = (issue.labels || []).map(label => {
        let labelColor = "bg-gray-100 text-gray-600"
        if (label === "bug") {
            labelColor = "bg-red-100 text-red-600"
        }
        else if (label === "enhancement") {
            labelColor = "bg-green-100 text-green-600"
        }
        else if (label === "help wanted") {
            labelColor = "bg-yellow-100 text-yellow-600"
        }
        else if (label === "documentation") {
            labelColor = "bg-blue-100 text-blue-600"
        }
        else {
            labelColor = "bg-yellow-100 text-yellow-600"
        }
        return `
        <span class="text-[10px] px-2 py-1 rounded-full ${labelColor}">
            ${label.toUpperCase()}
        </span>
        `
    }).join("")
    document.getElementById("modalLabel").innerHTML = labels
    document.getElementById("issueModal").showModal()
}