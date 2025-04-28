// Dashboard Interactivity Script

document.addEventListener('DOMContentLoaded', function() {
    // ===============================
    // SIDEBAR TOGGLE FUNCTIONALITY
    // ===============================
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    toggleSidebarBtn?.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });
    
    // ===============================
    // NOTIFICATIONS DROPDOWN
    // ===============================
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    
    notificationBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('active');
        
        // Close settings dropdown if open
        if (settingsDropdown && settingsDropdown.classList.contains('active')) {
            settingsDropdown.classList.remove('active');
        }
    });
    
    // ===============================
    // SETTINGS DROPDOWN
    // ===============================
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsDropdown = document.querySelector('.settings-dropdown');
    
    settingsBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsDropdown.classList.toggle('active');
        
        // Close notifications dropdown if open
        if (notificationDropdown && notificationDropdown.classList.contains('active')) {
            notificationDropdown.classList.remove('active');
        }
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function() {
        if (notificationDropdown && notificationDropdown.classList.contains('active')) {
            notificationDropdown.classList.remove('active');
        }
        if (settingsDropdown && settingsDropdown.classList.contains('active')) {
            settingsDropdown.classList.remove('active');
        }
    });
    
    // ===============================
    // CARBON FOOTPRINT CHART
    // ===============================
    const timeFilters = document.querySelectorAll('.time-filter');
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartLegend = document.querySelector('.chart-legend');
    
    // Sample data for the chart
    const chartData = {
        week: {
            values: [45, 65, 35, 50, 40, 30, 25],
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        month: {
            values: [60, 80, 50, 65, 45, 40, 30],
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        },
        year: {
            values: [70, 60, 50, 40, 45, 55, 65],
            labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec']
        }
    };
    
    // Update chart when time filter is clicked
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            timeFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Get selected time period
            const period = this.textContent.toLowerCase();
            
            // Update chart data
            updateChart(period);
        });
    });
    
    function updateChart(period) {
        const data = chartData[period] || chartData.month;
        
        // Update chart bars with animation
        chartBars.forEach((bar, index) => {
            if (index < data.values.length) {
                setTimeout(() => {
                    bar.style.height = data.values[index] + '%';
                }, index * 100);
            }
        });
        
        // Update chart labels
        if (chartLegend) {
            chartLegend.innerHTML = '';
            data.labels.forEach(label => {
                const span = document.createElement('span');
                span.textContent = label;
                chartLegend.appendChild(span);
            });
        }
    }
    
    // Initialize chart with month data
    updateChart('month');
    
    // ===============================
    // ECO TIPS CAROUSEL
    // ===============================
    const tipsContainer = document.querySelector('.tips-container');
    const tipItems = document.querySelectorAll('.tip-item');
    let currentTipIndex = 0;
    
    // Additional tips data
    const additionalTips = [
        {
            icon: 'fa-bicycle',
            title: 'Bike to Work',
            content: 'Cycling to work once a week can reduce your carbon emissions by up to 500kg per year.'
        },
        {
            icon: 'fa-recycling',
            title: 'Recycle Electronics',
            content: 'Recycling old electronics prevents hazardous waste and recovers valuable materials.'
        },
        {
            icon: 'fa-seedling',
            title: 'Plant a Garden',
            content: 'Growing your own vegetables reduces carbon emissions from food transportation.'
        }
    ];
    
    function rotateTips() {
        if (!tipsContainer || tipItems.length === 0) return;
        
        // Fade out current tips
        tipItems.forEach(tip => {
            tip.style.opacity = 0;
        });
        
        // After fade out, update tips content
        setTimeout(() => {
            // Generate new tips based on current index
            tipsContainer.innerHTML = '';
            
            for (let i = 0; i < 3; i++) {
                const tipIndex = (currentTipIndex + i) % (tipItems.length + additionalTips.length);
                
                const tipElement = document.createElement('div');
                tipElement.className = 'tip-item';
                
                if (tipIndex < tipItems.length) {
                    // Use existing tips
                    tipElement.innerHTML = tipItems[tipIndex].innerHTML;
                } else {
                    // Use additional tips
                    const additionalTipIndex = tipIndex - tipItems.length;
                    const tip = additionalTips[additionalTipIndex];
                    
                    tipElement.innerHTML = `
                        <div class="tip-icon">
                            <i class="fas ${tip.icon}"></i>
                        </div>
                        <div class="tip-content">
                            <h4>${tip.title}</h4>
                            <p>${tip.content}</p>
                        </div>
                    `;
                }
                
                tipsContainer.appendChild(tipElement);
            }
            
            // Fade in new tips
            const newTips = tipsContainer.querySelectorAll('.tip-item');
            newTips.forEach(tip => {
                tip.style.opacity = 1;
            });
            
            // Update current index
            currentTipIndex = (currentTipIndex + 1) % (tipItems.length + additionalTips.length);
        }, 500);
    }
    
    // Rotate tips every 10 seconds
    const tipsRotationInterval = setInterval(rotateTips, 10000);
    
    // ===============================
    // CHALLENGE INTERACTIONS
    // ===============================
    const joinButtons = document.querySelectorAll('.join-btn');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const challengeItem = this.closest('.challenge-item');
            
            // Change button text and style
            this.textContent = 'Joined';
            this.classList.add('joined');
            this.disabled = true;
            
            // Add progress bar to challenge
            const challengeInfo = challengeItem.querySelector('.challenge-info');
            
            // Remove upcoming class
            challengeItem.classList.remove('upcoming');
            challengeItem.classList.add('active');
            
            // Create progress bar if doesn't exist
            if (!challengeInfo.querySelector('.progress-bar')) {
                const progressBarHTML = `
                    <div class="progress-bar">
                        <div class="progress" style="width: 0%;"></div>
                    </div>
                `;
                challengeInfo.insertAdjacentHTML('beforeend', progressBarHTML);
                
                // Animate progress bar
                setTimeout(() => {
                    const progressBar = challengeInfo.querySelector('.progress');
                    progressBar.style.width = '5%';
                }, 100);
            }
            
            // Add status indicator
            if (!challengeItem.querySelector('.challenge-status')) {
                const statusHTML = `
                    <div class="challenge-status">
                        <span>5%</span>
                    </div>
                `;
                challengeItem.insertAdjacentHTML('beforeend', statusHTML);
            }
            
            // Show notification
            showNotification('You joined a new eco challenge!');
        });
    });
    
    // ===============================
    // DYNAMIC STATS COUNTER
    // ===============================
    const statValues = document.querySelectorAll('.stat-value');
    
    function animateCounter(element, target, duration = 2000) {
        if (!element) return;
        
        let startValue = 0;
        let startTime = null;
        let unit = '';
        
        // Extract numeric value and unit
        const text = element.textContent;
        const matches = text.match(/^([\d.]+)(.*)$/);
        
        if (matches) {
            target = parseFloat(matches[1]);
            unit = matches[2];
        }
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(progress * target);
            
            element.textContent = currentValue + unit;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = text; // Reset to exact value
            }
        }
        
        window.requestAnimationFrame(step);
    }
    
    // Animate stats on page load
    statValues.forEach(stat => {
        animateCounter(stat);
    });
    
    // ===============================
    // NOTIFICATION SYSTEM
    // ===============================
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <p>${message}</p>
            <button class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to the document
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.classList.remove('active');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // ===============================
    // COMMUNITY INTERACTION
    // ===============================
    const heartButtons = document.querySelectorAll('.post-actions button:first-child');
    const commentButtons = document.querySelectorAll('.post-actions button:last-child');
    
    heartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const countElement = this.querySelector('i').nextSibling;
            let count = parseInt(countElement.nodeValue);
            
            if (this.classList.contains('liked')) {
                // Unlike
                count--;
                this.classList.remove('liked');
            } else {
                // Like
                count++;
                this.classList.add('liked');
                showNotification('You liked a community post!');
            }
            
            countElement.nodeValue = ' ' + count;
        });
    });
    
    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postElement = this.closest('.community-post');
            const commentSection = postElement.querySelector('.comment-section');
            
            if (commentSection) {
                // Toggle comment section if it exists
                commentSection.classList.toggle('active');
            } else {
                // Create comment section if it doesn't exist
                const commentHTML = `
                    <div class="comment-section active">
                        <input type="text" class="comment-input" placeholder="Write a comment...">
                        <button class="comment-submit">Send</button>
                    </div>
                `;
                postElement.insertAdjacentHTML('beforeend', commentHTML);
                
                // Add functionality to new comment form
                const commentInput = postElement.querySelector('.comment-input');
                const commentSubmit = postElement.querySelector('.comment-submit');
                
                commentSubmit.addEventListener('click', function() {
                    if (commentInput.value.trim() !== '') {
                        showNotification('Comment posted successfully!');
                        commentInput.value = '';
                    }
                });
            }
        });
    });
    
    // ===============================
    // QUICK ACTION BUTTONS
    // ===============================
    const trackActivityBtn = document.querySelector('.action-btn.primary');
    const setGoalBtn = document.querySelector('.action-btn.secondary');
    
    trackActivityBtn?.addEventListener('click', function() {
        showModal('Track Daily Activity', `
            <form id="activity-form">
                <div class="form-group">
                    <label for="activity-type">Activity Type</label>
                    <select id="activity-type" required>
                        <option value="">Select activity type</option>
                        <option value="transportation">Transportation</option>
                        <option value="energy">Energy Usage</option>
                        <option value="food">Food Consumption</option>
                        <option value="waste">Waste Management</option>
                        <option value="water">Water Usage</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="activity-value">Value</label>
                    <input type="number" id="activity-value" placeholder="Enter value" required>
                </div>
                <div class="form-group">
                    <label for="activity-unit">Unit</label>
                    <select id="activity-unit" required>
                        <option value="">Select unit</option>
                        <option value="km">Kilometers</option>
                        <option value="kWh">Kilowatt Hours</option>
                        <option value="kg">Kilograms</option>
                        <option value="L">Liters</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="activity-date">Date</label>
                    <input type="date" id="activity-date" required>
                </div>
                <div class="form-group">
                    <label for="activity-notes">Notes</label>
                    <textarea id="activity-notes" placeholder="Additional details..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Save Activity</button>
                </div>
            </form>
        `);
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('activity-date').value = today;
        
        // Form submission
        const activityForm = document.getElementById('activity-form');
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            closeModal();
            showNotification('Activity tracked successfully!');
            
            // Update stats (simulating real-time updates)
            setTimeout(() => {
                const ecoScoreElement = document.querySelector('.stat-icon.eco-score + .stat-details .stat-value');
                if (ecoScoreElement) {
                    const currentScore = parseInt(ecoScoreElement.textContent);
                    ecoScoreElement.textContent = (currentScore + 1);
                }
                
                const activitiesElement = document.querySelector('.stat-icon.activities + .stat-details .stat-value');
                if (activitiesElement) {
                    const currentActivities = parseInt(activitiesElement.textContent);
                    activitiesElement.textContent = (currentActivities + 1);
                }
            }, 1000);
        });
    });
    
    setGoalBtn?.addEventListener('click', function() {
        showModal('Set New Eco Goal', `
            <form id="goal-form">
                <div class="form-group">
                    <label for="goal-type">Goal Type</label>
                    <select id="goal-type" required>
                        <option value="">Select goal type</option>
                        <option value="carbon">Reduce Carbon Footprint</option>
                        <option value="energy">Reduce Energy Consumption</option>
                        <option value="waste">Reduce Waste</option>
                        <option value="water">Reduce Water Usage</option>
                        <option value="activities">Complete Eco Activities</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="goal-target">Target Value</label>
                    <input type="number" id="goal-target" placeholder="Enter target value" required>
                </div>
                <div class="form-group">
                    <label for="goal-deadline">Deadline</label>
                    <input type="date" id="goal-deadline" required>
                </div>
                <div class="form-group">
                    <label for="goal-notes">Notes</label>
                    <textarea id="goal-notes" placeholder="Why is this goal important to you?"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Save Goal</button>
                </div>
            </form>
        `);
        
        // Set default deadline (1 month from now)
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        document.getElementById('goal-deadline').value = oneMonthFromNow.toISOString().split('T')[0];
        
        // Form submission
        const goalForm = document.getElementById('goal-form');
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            closeModal();
            showNotification('New eco goal set successfully!');
        });
    });
    
    // ===============================
    // MODAL SYSTEM
    // ===============================
    function showModal(title, content) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.modal-container');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal-container';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;
        
        // Add to the document
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Close button functionality
        const closeBtn = modal.querySelector('.close-modal');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }
    
    function closeModal() {
        const modal = document.querySelector('.modal-container');
        if (modal) {
            modal.classList.remove('active');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // ===============================
    // SEARCH FUNCTIONALITY
    // ===============================
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            showNotification(`Searching for "${this.value}"...`);
            this.value = '';
        }
    });
});