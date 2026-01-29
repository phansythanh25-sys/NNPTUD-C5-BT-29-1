const API_URL = 'http://localhost:3000';
let posts = [];
let comments = [];

// ============ POSTS FUNCTIONS ============

// Load all posts
async function LoadPosts() {
    try {
        let res = await fetch(`${API_URL}/posts`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        posts = await res.json();
        RenderPosts();
    } catch (error) {
        console.error("❌ Lỗi load posts:", error);
        document.getElementById('post-table-body').innerHTML = `<tr><td colspan="5" class="text-danger">Lỗi: ${error.message}</td></tr>`;
    }
}

// Render posts in table
function RenderPosts() {
    let body = document.getElementById('post-table-body');
    body.innerHTML = '';
    for (const post of posts) {
        const isDeleted = post.isDeleted || false;
        const rowClass = isDeleted ? 'deleted' : '';
        const status = isDeleted ? '<span class="badge bg-danger">Deleted</span>' : '<span class="badge bg-success">Active</span>';
        
        body.innerHTML += `
            <tr class="${rowClass}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${status}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="EditPost('${post.id}')">Edit</button>
                    ${!isDeleted ? `<button class="btn btn-sm btn-danger" onclick="SoftDeletePost('${post.id}')">Delete</button>` : `<button class="btn btn-sm btn-info" onclick="RestorePost('${post.id}')">Restore</button>`}
                </td>
            </tr>`;
    }
}

// Get next ID
function GetNextId(items) {
    if (items.length === 0) return "1";
    const maxId = Math.max(...items.map(item => parseInt(item.id) || 0));
    return String(maxId + 1);
}

// Save post (create or update)
async function SavePost() {
    let title = document.getElementById('post_title_txt').value.trim();
    let views = document.getElementById('post_views_txt').value.trim();
    
    if (!title || !views) {
        alert('⚠️ Vui lòng nhập đầy đủ thông tin');
        return;
    }
    
    try {
        // Check if updating existing post
        let res = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: GetNextId(posts),
                title: title,
                views: views,
                isDeleted: false
            })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        console.log('✅ Thêm post thành công');
        document.getElementById('post_title_txt').value = '';
        document.getElementById('post_views_txt').value = '';
        await LoadPosts();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// Edit post
async function EditPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    const newTitle = prompt('Chỉnh sửa tiêu đề:', post.title);
    if (newTitle === null) return;
    
    const newViews = prompt('Chỉnh sửa views:', post.views);
    if (newViews === null) return;
    
    try {
        let res = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                views: newViews
            })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('✅ Chỉnh sửa post thành công');
        await LoadPosts();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// Soft delete post
async function SoftDeletePost(id) {
    if (!confirm('Bạn chắc chắn muốn xóa post này?')) return;
    
    try {
        let res = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: true })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('✅ Xóa post thành công');
        await LoadPosts();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// Restore post
async function RestorePost(id) {
    if (!confirm('Bạn chắc chắn muốn khôi phục post này?')) return;
    
    try {
        let res = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('✅ Khôi phục post thành công');
        await LoadPosts();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// ============ COMMENTS FUNCTIONS ============

// Load all comments
async function LoadComments() {
    try {
        let res = await fetch(`${API_URL}/comments`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        comments = await res.json();
        RenderComments();
    } catch (error) {
        console.error("❌ Lỗi load comments:", error);
        document.getElementById('comment-table-body').innerHTML = `<tr><td colspan="5" class="text-danger">Lỗi: ${error.message}</td></tr>`;
    }
}

// Render comments in table
function RenderComments() {
    let body = document.getElementById('comment-table-body');
    body.innerHTML = '';
    for (const comment of comments) {
        const isDeleted = comment.isDeleted || false;
        const rowClass = isDeleted ? 'deleted' : '';
        const status = isDeleted ? '<span class="badge bg-danger">Deleted</span>' : '<span class="badge bg-success">Active</span>';
        
        body.innerHTML += `
            <tr class="${rowClass}">
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId}</td>
                <td>${status}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="EditComment('${comment.id}')">Edit</button>
                    ${!isDeleted ? `<button class="btn btn-sm btn-danger" onclick="SoftDeleteComment('${comment.id}')">Delete</button>` : `<button class="btn btn-sm btn-info" onclick="RestoreComment('${comment.id}')">Restore</button>`}
                </td>
            </tr>`;
    }
}

// Save comment (create or update)
async function SaveComment() {
    let text = document.getElementById('comment_text_txt').value.trim();
    let postId = document.getElementById('comment_postid_txt').value.trim();
    
    if (!text || !postId) {
        alert('⚠️ Vui lòng nhập đầy đủ thông tin');
        return;
    }
    
    try {
        let res = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: GetNextId(comments),
                text: text,
                postId: postId,
                isDeleted: false
            })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        console.log('✅ Thêm comment thành công');
        document.getElementById('comment_text_txt').value = '';
        document.getElementById('comment_postid_txt').value = '';
        await LoadComments();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// Edit comment
async function EditComment(id) {
    const comment = comments.find(c => c.id === id);
    if (!comment) return;
    
    const newText = prompt('Chỉnh sửa comment:', comment.text);
    if (newText === null) return;
    
    try {
        let res = await fetch(`${API_URL}/comments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('✅ Chỉnh sửa comment thành công');
        await LoadComments();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// Soft delete comment
async function SoftDeleteComment(id) {
    if (!confirm('Bạn chắc chắn muốn xóa comment này?')) return;
    
    try {
        let res = await fetch(`${API_URL}/comments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: true })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('✅ Xóa comment thành công');
        await LoadComments();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// Restore comment
async function RestoreComment(id) {
    if (!confirm('Bạn chắc chắn muốn khôi phục comment này?')) return;
    
    try {
        let res = await fetch(`${API_URL}/comments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false })
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('✅ Khôi phục comment thành công');
        await LoadComments();
    } catch (error) {
        alert(`❌ Lỗi: ${error.message}`);
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    LoadPosts();
    LoadComments();
});
