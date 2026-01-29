// ========================================
// Fetch API: Load Data từ GitHub
// ========================================
// Thay URL bên dưới bằng link RAW db.json của bạn từ GitHub
// Ví dụ: https://raw.githubusercontent.com/ThanhHollow/fetch-data-exercise/main/db.json

const API_URL = "https://raw.githubusercontent.com/phansythanh25-sys/NNPTUD-C5-BT-29-1/refs/heads/main/db.json";

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

        // Lấy mảng users (giả sử db.json có cấu trúc { "users": [...] })
        const users = data.users || data;

        // Kiểm tra xem users có phải là mảng không
        if (!Array.isArray(users)) {
            throw new Error('Dữ liệu không phải là mảng');
        }

        // Lấy element container
        const container = document.getElementById('data-container');
        container.innerHTML = ""; // Xóa dòng "Đang tải"

        // Nếu không có dữ liệu
        if (users.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999;">Không có dữ liệu.</div>';
            return;
        }

        // Duyệt qua từng user và tạo element
        users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <h3>${user.name || 'N/A'}</h3>
                <p>📧 <strong>Email:</strong> ${user.email || 'N/A'}</p>
                <p>🆔 <strong>ID:</strong> ${user.id || 'N/A'}</p>
                ${user.role ? `<span class="role">${user.role}</span>` : ''}
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
