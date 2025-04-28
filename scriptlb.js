document.addEventListener("DOMContentLoaded", function () {
    // DOM elements
    const leaderboardBody = document.getElementById("leaderboard-body");
    const searchInput = document.getElementById("search-input");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");
    const timePeriodBtns = document.querySelectorAll(".time-btn");
    
    // Pagination and filtering state
    let currentPage = 1;
    const rowsPerPage = 10;
    let currentTimePeriod = "week";
    let sortDirection = "desc"; // Default sort by points descending
    
    // Extended leaderboard data
    const leaderboardData = [
        { 
            rank: 1, 
            name: "BIKASH", 
            points: 1200, 
            actions: 42, 
            carbonSaved: 320,
            image: "alice.jpg" 
        },
        { 
            rank: 2, 
            name: "Bob Earth", 
            points: 1100, 
            actions: 38, 
            carbonSaved: 290,
            image: "bob.jpg" 
        },
        { 
            rank: 3, 
            name: "Charlie Planet", 
            points: 950, 
            actions: 35, 
            carbonSaved: 250,
            image: "charlie.jpg" 
        },
        { 
            rank: 4, 
            name: "Diana Eco", 
            points: 900, 
            actions: 32, 
            carbonSaved: 230,
            image: "diana.jpg" 
        },
        { 
            rank: 5, 
            name: "Evan Leaf", 
            points: 850, 
            actions: 30, 
            carbonSaved: 210,
            image: "evan.jpg" 
        },
        { 
            rank: 6, 
            name: "Fiona Green", 
            points: 820, 
            actions: 28, 
            carbonSaved: 200,
            image: "user-placeholder.jpg" 
        },
        { 
            rank: 7, 
            name: "Greg Sustainability", 
            points: 790, 
            actions: 27, 
            carbonSaved: 190,
            image: "user-placeholder.jpg" 
        },
        { 
            rank: 8, 
            name: "Hannah Nature", 
            points: 760, 
            actions: 26, 
            carbonSaved: 185,
            image: "user-placeholder.jpg" 
        },
        { 
            rank: 9, 
            name: "Ian Forest", 
            points: 730, 
            actions: 25, 
            carbonSaved: 180,
            image: "user-placeholder.jpg" 
        },
        { 
            rank: 10, 
            name: "Julia Ocean", 
            points: 710, 
            actions: 24, 
            carbonSaved: 175,
            image: "user-placeholder.jpg" 
        },
        { 
            rank: 11, 
            name: "Kyle Environment", 
            points: 690, 
            actions: 23, 
            carbonSaved: 170,
            image: "user-placeholder.jpg" 
        },
        { 
            rank: 12, 
            name: "Laura Recycle", 
            points: 670, 
            actions: 22, 
            carbonSaved: 165,
            image: "user-placeholder.jpg" 
        },
        { 
            rank: 13, 
            name: "Mike Clean", 
            points: 650, 
            actions: 21, 
            carbonSaved: 160,
            image: "user-placeholder.jpg" 
        }
    ];
    
    // Different data sets for time periods
    const timeData = {
        week: leaderboardData,
        month: leaderboardData.map(item => ({
            ...item,
            points: Math.floor(item.points * 1.5),
            actions: Math.floor(item.actions * 1.5),
            carbonSaved: Math.floor(item.carbonSaved * 1.5)
        })),
        alltime: leaderboardData.map(item => ({
            ...item,
            points: Math.floor(item.points * 4),
            actions: Math.floor(item.actions * 4),
            carbonSaved: Math.floor(item.carbonSaved * 4)
        }))
    };
    
    // Filter, sort, and paginate the data
    function getFilteredData() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        return timeData[currentTimePeriod].filter(user => 
            user.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Render the leaderboard with pagination
    function renderLeaderboard() {
        // Clear existing rows
        leaderboardBody.innerHTML = "";
        
        // Get filtered data
        let filteredData = getFilteredData();
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        // Update pagination controls
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // Check if no results
        if (paginatedData.length === 0) {
            const emptyRow = document.createElement("tr");
            emptyRow.innerHTML = `
                <td colspan="5" class="empty-message">No results found. Try a different search term.</td>
            `;
            leaderboardBody.appendChild(emptyRow);
            return;
        }
        
        // Add rows with animation
        paginatedData.forEach((user, index) => {
            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td class="rank rank-${user.rank}">${user.rank}</td>
                <td>
                    <div class="user-info">
                        <img src="${user.image}" alt="${user.name}" class="profile" onerror="this.src='user-placeholder.jpg'">
                        <span>${user.name}</span>
                    </div>
                </td>
                <td>${user.points.toLocaleString()}</td>
                <td>${user.actions}</td>
                <td>${user.carbonSaved} kg</td>
            `;
            
            // Animation effect for fade-in
            row.style.opacity = "0";
            setTimeout(() => {
                row.style.opacity = "1";
                row.style.transition = "opacity 0.3s ease-in-out";
            }, 50 * index);
            
            leaderboardBody.appendChild(row);
        });
    }
    
    // Time period selector
    timePeriodBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            // Update active button
            timePeriodBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            
            // Update time period and reset to first page
            currentTimePeriod = this.dataset.period;
            currentPage = 1;
            renderLeaderboard();
        });
    });
    
    // Search functionality
    searchInput.addEventListener("input", function() {
        currentPage = 1; // Reset to first page
        renderLeaderboard();
    });
    
    // Pagination controls
    prevPageBtn.addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            renderLeaderboard();
        }
    });
    
    nextPageBtn.addEventListener("click", function() {
        const filteredData = getFilteredData();
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderLeaderboard();
        }
    });
    
    // Column sorting
    document.querySelectorAll("#leaderboard-table th").forEach(header => {
        header.addEventListener("click", function() {
            const column = this.textContent.trim().toLowerCase().split(" ")[0];
            
            // Only implement sorting for points column in this example
            if (column === "points") {
                sortDirection = sortDirection === "asc" ? "desc" : "asc";
                
                // Update sort icon
                const icon = this.querySelector("i");
                icon.className = sortDirection === "asc" ? 
                    "fas fa-sort-up" : "fas fa-sort-down";
                
                // Sort the data
                timeData[currentTimePeriod].sort((a, b) => {
                    return sortDirection === "asc" ? 
                        a.points - b.points : b.points - a.points;
                });
                
                currentPage = 1; // Reset to first page
                renderLeaderboard();
            }
        });
    });
    
    // Simulate user stats update
    function updateUserStats() {
        document.getElementById("user-rank").textContent = "28";
        document.getElementById("user-points").textContent = "650";
        document.getElementById("user-actions").textContent = "23";
        document.getElementById("user-carbon").textContent = "125 kg";
    }
    
    // Initial render
    renderLeaderboard();
    updateUserStats();
    
    // Add tooltip functionality
    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach(item => {
        item.setAttribute("title", "Keep taking actions to improve this stat!");
    });
    
    // Add CTA button functionality
    document.querySelector(".cta-button").addEventListener("click", function() {
        window.location.href = "actions.html";
    });
    
    console.log("✅ Enhanced Leaderboard Initialization Complete");
});