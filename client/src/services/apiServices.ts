import axiosInstance from "../api/axiosInstance";

export const verifyUser = async () => {
    try {
        const response = await axiosInstance.get('/user/verify');
        return response;
    } catch (error) {
        console.error('Error verifying user:', error.message);
        throw error;
    }
};



export const addPost = async (post) => {
    try {
        const response = await axiosInstance.post('/posts/add', post, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            }
        });
        return response;
    } catch (error) {
        console.error('Error adding post:', error.message);
        throw error;
    }
};

export const getPost = async (page) => {
    try {
        const postsPerPage = 10; 
        const response = await axiosInstance.get('/posts', {
            params: {
                page,         
                limit: postsPerPage, 
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        throw error;
    }
};

export const postReaction = async (data) => {
    try {
        const response = await axiosInstance.post('/posts/reaction', data);
        return response;
    } catch (error) {
        console.error('Error adding post:', error.message);
        throw error;
    }
}


export const postLoginSuccessHandler = async (credential) => {
    try {
        const response = await axiosInstance.post('/auth/login', { credential });
        return response;
    } catch (error) {
        console.error('Error adding post:', error.message);
        throw error;
    }
}


export const getMostLikedPosts = async () => {
    try {
        const response = await axiosInstance.get('/posts/mostlikedposts');
        return response;
    } catch (error) {
        console.error('Error getting Most Liked posts:', error.message);
        throw error;
    }
};