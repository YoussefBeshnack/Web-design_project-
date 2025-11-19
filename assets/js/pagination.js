const paginationContainer = document.getElementById("pagination");

let currentPage = 1;      // start page 1
let totalPages = 12;

function renderPagination() {
    paginationContainer.innerHTML = ""; 

    const pag = document.createElement("div");
    pag.className = "pagination";

    // previous button
    const prev = document.createElement("button");
    prev.className = "btn box prev";
    prev.innerHTML = `<i class="ri-arrow-left-line"></i>`;
    prev.disabled = currentPage === 1;
    prev.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderPagination();
        }
    };
    pag.appendChild(prev);

    function pageButton(num) {
        const btn = document.createElement("button");
        btn.className = "box";
        btn.textContent = num;

        if (num === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentPage = num;
            renderPagination();
        };

        pag.appendChild(btn);
    }

    pageButton(1);

    // left dots
    if (currentPage > 3) {
        const dots = document.createElement("button");
        dots.className = "dots";
        dots.textContent = "...";
        pag.appendChild(dots);
    }

    // pages around active page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        pageButton(i);
    }

    // right dots
    if (currentPage < totalPages - 2) {
        const dots = document.createElement("button");
        dots.className = "dots";
        dots.textContent = "...";
        pag.appendChild(dots);
    }

    // last page
    if (totalPages > 1) {
        pageButton(totalPages);
    }

    // next button
    const next = document.createElement("button");
    next.className = "btn box next";
    next.innerHTML = `<i class="ri-arrow-right-line"></i>`;
    next.disabled = currentPage === totalPages;
    next.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPagination();
        }
    };
    pag.appendChild(next);

    paginationContainer.appendChild(pag);
}

renderPagination();
