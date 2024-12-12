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
        const response = await axiosInstance.post('/posts/add', post);
        return response;
    } catch (error) {
        console.error('Error adding post:', error.message);
        throw error;
    }
};


export const getPost = async () => {
    try {
        const response = await axiosInstance.get('/posts');
        return response;
    } catch (error) {
        console.error('Error adding post:', error.message);
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
        const response = await axiosInstance.post('/auth/login', {credential});
        return response;
    } catch (error) {
        console.error('Error adding post:', error.message);
        throw error;
    }
}