// ========================================
// Fetch API: Load Data từ GitHub
// ========================================

const API_URL = "https://raw.githubusercontent.com/phansythanh25-sys/NNPTUD-C5-BT-29-1/main/db.json";

// Biến lưu trữ dữ liệu gốc
let allProducts = [];
let filteredProducts = [];
let sortType = null; // 'nameAsc', 'nameDesc', 'priceAsc', 'priceDesc'

/**
 * Hàm loadData: Lấy dữ liệu từ GitHub
 */
async function loadData() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Xử lý dữ liệu
        let products = Array.isArray(data) ? data : (data.products || data.items || data.users || data);
        
        if (!Array.isArray(products)) {
            throw new Error('Dữ liệu không phải là mảng');
        }

        allProducts = products;
        filteredProducts = [...allProducts];
        
        console.log(`✓ Tải ${allProducts.length} sản phẩm`);
        renderTable();

    } catch (error) {
        console.error("❌ Lỗi:", error);
        document.getElementById('tableContainer').innerHTML = `
            <div class="error">
                <strong>Không thể tải dữ liệu!</strong><br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

/**
 * Hàm tìm kiếm sản phẩm
 */
function searchProducts(keyword) {
    keyword = keyword.toLowerCase().trim();
    
    if (keyword === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(keyword)
        );
    }
    
    // Reset sort khi tìm kiếm
    sortType = null;
    updateSortButtons();
    renderTable();
}

/**
 * Hàm sắp xếp sản phẩm
 */
function sortProducts(type) {
    sortType = type;
    
    switch(type) {
        case 'nameAsc':
            filteredProducts.sort((a, b) => 
                (a.title || '').localeCompare(b.title || '', 'vi')
            );
            break;
        case 'nameDesc':
            filteredProducts.sort((a, b) => 
                (b.title || '').localeCompare(a.title || '', 'vi')
            );
            break;
        case 'priceAsc':
            filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'priceDesc':
            filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
    }
    
    updateSortButtons();
    renderTable();
}

/**
 * Cập nhật trạng thái nút sort
 */
function updateSortButtons() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (sortType) {
        const activeBtn = document.getElementById(`sort${sortType.charAt(0).toUpperCase() + sortType.slice(1)}`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}

/**
 * Hàm render bảng
 */
function renderTable() {
    const tableContainer = document.getElementById('tableContainer');
    
    // Cập nhật số kết quả
    document.getElementById('resultCount').textContent = filteredProducts.length;
    
    if (filteredProducts.length === 0) {
        tableContainer.innerHTML = '<div class="no-data">Không tìm thấy sản phẩm nào.</div>';
        return;
    }

    let tableHTML = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="text-align: left;">ID</th>
                    <th style="text-align: left;">Tên Sản Phẩm</th>
                    <th style="text-align: center;">Danh Mục</th>
                    <th style="text-align: right;">Giá</th>
                    <th style="text-align: left;">Mô Tả</th>
                    <th style="text-align: center;">Hình Ảnh</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredProducts.forEach(product => {
        const title = product.title || 'N/A';
        const category = product.category?.name || 'N/A';
        const price = product.price || 0;
        const description = (product.description || 'N/A').substring(0, 50);
        const id = product.id || 'N/A';
        const imageUrl = product.images?.[0] || '';

        tableHTML += `
            <tr>
                <td class="product-id"><strong>${id}</strong></td>
                <td class="product-title">${escapeHtml(title)}</td>
                <td style="text-align: center;">
                    <span class="product-category">${escapeHtml(category)}</span>
                </td>
                <td style="text-align: right;">
                    <span class="product-price">$${price.toLocaleString()}</span>
                </td>
                <td style="color: #666; font-size: 13px;">${escapeHtml(description)}...</td>
                <td style="text-align: center;">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(title)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; cursor: pointer;" title="Nhấp để xem ảnh">` : '<span style="color: #ccc;">Không có ảnh</span>'}
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}

/**
 * Hàm escape HTML để tránh XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });

    // Sort buttons
    document.getElementById('sortNameAsc').addEventListener('click', () => sortProducts('nameAsc'));
    document.getElementById('sortNameDesc').addEventListener('click', () => sortProducts('nameDesc'));
    document.getElementById('sortPriceAsc').addEventListener('click', () => sortProducts('priceAsc'));
    document.getElementById('sortPriceDesc').addEventListener('click', () => sortProducts('priceDesc'));
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadData();
});
