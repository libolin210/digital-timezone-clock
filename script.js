// List of all available timezones
const ALL_TIMEZONES = [
    'Africa/Johannesburg', 'Africa/Cairo', 'Africa/Lagos', 'Africa/Nairobi',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Anchorage', 'America/Toronto', 'America/Mexico_City', 'America/Buenos_Aires',
    'America/Sao_Paulo', 'America/Lima', 'America/Caracas',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore', 'Asia/Bangkok',
    'Asia/Dubai', 'Asia/Kolkata', 'Asia/Jakarta', 'Asia/Manila', 'Asia/Seoul',
    'Asia/Taipei', 'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
    'Australia/Perth', 'Australia/Adelaide', 'Australia/Hobart',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Amsterdam',
    'Europe/Rome', 'Europe/Vienna', 'Europe/Prague', 'Europe/Stockholm', 'Europe/Moscow',
    'Europe/Istanbul', 'Europe/Athens', 'Europe/Dublin', 'Europe/Lisbon',
    'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Tongatapu',
    'UTC', 'America/Godthab', 'Atlantic/Azores', 'Atlantic/Cape_Verde'
];

// Timezone display names mapping
const TIMEZONE_NAMES = {
    'America/New_York': 'New York (EST/EDT)',
    'America/Chicago': 'Chicago (CST/CDT)',
    'America/Denver': 'Denver (MST/MDT)',
    'America/Los_Angeles': 'Los Angeles (PST/PDT)',
    'America/Anchorage': 'Anchorage (AKST/AKDT)',
    'America/Toronto': 'Toronto (EST/EDT)',
    'America/Mexico_City': 'Mexico City (CST)',
    'America/Buenos_Aires': 'Buenos Aires (ART)',
    'America/Sao_Paulo': 'São Paulo (BRT)',
    'America/Lima': 'Lima (PET)',
    'America/Caracas': 'Caracas (VET)',
    'America/Godthab': 'Greenland (WGT)',
    'Atlantic/Azores': 'Azores (AZOT)',
    'Atlantic/Cape_Verde': 'Cape Verde (CVT)',
    'Africa/Johannesburg': 'Johannesburg (SAST)',
    'Africa/Cairo': 'Cairo (EET)',
    'Africa/Lagos': 'Lagos (WAT)',
    'Africa/Nairobi': 'Nairobi (EAT)',
    'Asia/Dubai': 'Dubai (GST)',
    'Asia/Kolkata': 'Kolkata (IST)',
    'Asia/Bangkok': 'Bangkok (ICT)',
    'Asia/Jakarta': 'Jakarta (WIB)',
    'Asia/Manila': 'Manila (PHT)',
    'Asia/Singapore': 'Singapore (SGT)',
    'Asia/Hong_Kong': 'Hong Kong (HKT)',
    'Asia/Shanghai': 'Shanghai (CST)',
    'Asia/Seoul': 'Seoul (KST)',
    'Asia/Taipei': 'Taipei (CST)',
    'Asia/Tokyo': 'Tokyo (JST)',
    'Australia/Perth': 'Perth (AWST)',
    'Australia/Adelaide': 'Adelaide (ACST)',
    'Australia/Brisbane': 'Brisbane (AEST)',
    'Australia/Melbourne': 'Melbourne (AEST)',
    'Australia/Sydney': 'Sydney (AEST)',
    'Australia/Hobart': 'Hobart (AEST)',
    'Europe/London': 'London (GMT/BST)',
    'Europe/Paris': 'Paris (CET/CEST)',
    'Europe/Berlin': 'Berlin (CET/CEST)',
    'Europe/Madrid': 'Madrid (CET/CEST)',
    'Europe/Amsterdam': 'Amsterdam (CET/CEST)',
    'Europe/Rome': 'Rome (CET/CEST)',
    'Europe/Vienna': 'Vienna (CET/CEST)',
    'Europe/Prague': 'Prague (CET/CEST)',
    'Europe/Stockholm': 'Stockholm (CET/CEST)',
    'Europe/Moscow': 'Moscow (MSK)',
    'Europe/Istanbul': 'Istanbul (EET)',
    'Europe/Athens': 'Athens (EET)',
    'Europe/Dublin': 'Dublin (GMT/IST)',
    'Europe/Lisbon': 'Lisbon (WET/WEST)',
    'Pacific/Auckland': 'Auckland (NZDT)',
    'Pacific/Fiji': 'Fiji (FJT)',
    'Pacific/Tongatapu': 'Tonga (TOT)',
    'UTC': 'UTC (Universal Time)'
};

// Initialize app
class TimezoneClockApp {
    constructor() {
        this.clocks = JSON.parse(localStorage.getItem('selectedTimezones')) || ['UTC', 'America/New_York', 'Asia/Tokyo'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderClocks();
        this.updateClocks();
        // Update clocks every second
        setInterval(() => this.updateClocks(), 1000);
    }

    setupEventListeners() {
        const addBtn = document.getElementById('addBtn');
        const searchInput = document.getElementById('timezoneSearch');
        const presetBtns = document.querySelectorAll('.preset-btn');

        addBtn.addEventListener('click', () => this.addTimezone());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTimezone();
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const timezone = btn.getAttribute('data-timezone');
                this.addTimezone(timezone);
            });
        });
    }

    addTimezone(timezone = null) {
        if (!timezone) {
            timezone = document.getElementById('timezoneSearch').value.trim().toUpperCase();
        }

        // Convert to proper timezone format
        timezone = timezone.replace(/\s/g, '_');

        // Validate timezone
        if (!this.isValidTimezone(timezone)) {
            alert(`Invalid timezone: "${timezone}"\n\nPlease use format like:\n- America/New_York\n- Europe/London\n- Asia/Tokyo`);
            return;
        }

        // Check if already added
        if (this.clocks.includes(timezone)) {
            alert('This timezone is already added!');
            return;
        }

        // Add timezone
        this.clocks.push(timezone);
        this.saveToLocalStorage();
        this.renderClocks();

        // Clear input
        document.getElementById('timezoneSearch').value = '';
    }

    removeTimezone(timezone) {
        this.clocks = this.clocks.filter(tz => tz !== timezone);
        this.saveToLocalStorage();
        this.renderClocks();
    }

    isValidTimezone(timezone) {
        // Check if timezone exists in Intl API
        try {
            Intl.DateTimeFormat(undefined, { timeZone: timezone });
            return true;
        } catch (ex) {
            return ALL_TIMEZONES.includes(timezone);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('selectedTimezones', JSON.stringify(this.clocks));
    }

    renderClocks() {
        const container = document.getElementById('clocksContainer');

        if (this.clocks.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h2>No timezones selected</h2>
                    <p>Add a timezone using the search box or preset buttons above</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.clocks.map(timezone => `
            <div class="clock-card">
                <button class="remove-btn" onclick="app.removeTimezone('${timezone}')">×</button>
                <div class="timezone-name">${this.getTimezoneName(timezone)}</div>
                <div class="digital-time" id="time-${timezone}">--:--:--</div>
                <div class="date-display" id="date-${timezone}"></div>
                <div class="offset-info" id="offset-${timezone}"></div>
            </div>
        `).join('');
    }

    getTimezoneName(timezone) {
        return TIMEZONE_NAMES[timezone] || timezone;
    }

    updateClocks() {
        const now = new Date();

        this.clocks.forEach(timezone => {
            try {
                // Get time in specific timezone
                const timeStr = now.toLocaleString('en-US', {
                    timeZone: timezone,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                const dateStr = now.toLocaleDateString('en-US', {
                    timeZone: timezone,
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                // Calculate offset
                const offset = this.getTimezoneOffset(timezone);

                // Update DOM
                const timeElement = document.getElementById(`time-${timezone}`);
                const dateElement = document.getElementById(`date-${timezone}`);
                const offsetElement = document.getElementById(`offset-${timezone}`);

                if (timeElement) timeElement.textContent = timeStr;
                if (dateElement) dateElement.textContent = dateStr;
                if (offsetElement) offsetElement.textContent = offset;
            } catch (error) {
                console.error(`Error updating timezone ${timezone}:`, error);
            }
        });
    }

    getTimezoneOffset(timezone) {
        const now = new Date();
        
        // Get UTC time
        const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        
        // Get time in target timezone
        const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        
        // Calculate difference in minutes
        const diffMs = utcTime - tzTime;
        const diffMins = Math.round(diffMs / 60000);
        const hours = Math.floor(Math.abs(diffMins) / 60);
        const mins = Math.abs(diffMins) % 60;
        
        const sign = diffMins >= 0 ? '+' : '-';
        const paddedHours = String(hours).padStart(2, '0');
        const paddedMins = String(mins).padStart(2, '0');
        
        return `UTC ${sign}${paddedHours}:${paddedMins}`;
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TimezoneClockApp();
});
