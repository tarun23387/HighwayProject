// Sidebar collapse / expand toggle (desktop).
// Below the lg breakpoint Bootstrap's offcanvas handles open/close.
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');

toggleBtn.addEventListener('click', function () {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
});
