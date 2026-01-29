// ========================================
// Fetch API: Load Data từ GitHub
// ========================================
// Thay URL bên dưới bằng link RAW db.json của bạn từ GitHub
// Ví dụ: https://raw.githubusercontent.com/ThanhHollow/fetch-data-exercise/main/db.json

const API_URL = "https://raw.githubusercontent.com/phansythanh25-sys/NNPTUD-C5-BT-29-1/main/db.json";

/**
 * Hàm loadData: Lấy dữ liệu từ GitHub và hiển thị trên trang
 */
async function loadData() {
    try {
        // Thêm CORS header nếu cần
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        // Kiểm tra response có thành công không
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // Parse JSON từ response
        const data = await response.json();
        console.log('Dữ liệu được tải:', data);
        console.log('Loại dữ liệu:', typeof data);

        // Lấy mảng products - kiểm tra nhiều khả năng
        let products;
        
        if (Array.isArray(data)) {
            products = data;
            console.log('✓ Dữ liệu là mảng trực tiếp');
        } else if (data && typeof data === 'object') {
            // Thử lấy từ các thuộc tính phổ biến
            products = data.products || data.items || data.users || data.data;
            console.log('Cấu trúc object, lấy key:', Object.keys(data).slice(0, 5));
        }

        // Kiểm tra xem products có phải là mảng không
        if (!Array.isArray(products)) {
            console.error('Dữ liệu không hợp lệ:', data);
            throw new Error(`Dữ liệu không phải là mảng. Nhận được: ${typeof products}`);
        }

        // Lấy element container
        const container = document.getElementById('data-container');
        container.innerHTML = ""; // Xóa dòng "Đang tải"

        // Nếu không có dữ liệu
        if (products.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999;">Không có dữ liệu.</div>';
            return;
        }

        // Duyệt qua từng sản phẩm và tạo element
        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <h3>💼 ${product.title || 'N/A'}</h3>
                <p><strong>Giá:</strong> $${product.price || 'N/A'}</p>
                <p><strong>Danh mục:</strong> ${product.category?.name || 'N/A'}</p>
                <p><strong>Mô tả:</strong> ${(product.description || 'N/A').substring(0, 80)}...</p>
                <p>🆔 <strong>ID:</strong> ${product.id || 'N/A'}</p>
                ${product.images?.[0] ? `<img src="${product.images[0]}" alt="${product.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-top: 10px;">` : ''}
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error("❌ Lỗi khi load data:", error);
        const container = document.getElementById('data-container');
        container.innerHTML = `
            <div class="error" style="grid-column: 1/-1;">
                <strong>Không thể tải dữ liệu!</strong><br>
                <small>Lỗi: ${error.message}</small><br>
                <small>Vui lòng kiểm tra URL API hoặc kết nối internet.</small>
            </div>
        `;
    }
}

// Gọi hàm loadData khi trang tải xong
document.addEventListener('DOMContentLoaded', loadData);
