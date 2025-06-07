import {create} from 'zustand';
import axios from 'axios';

export const useNotification=create((set)=>({
    notifications: [],
  isLoading: false,
  error: null,

  getNotifications: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get("http://localhost:4005/api/notifications", {
        withCredentials: true,
      });
      set({ notifications: res.data, isLoading: false });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      set({ error: err.message, isLoading: false });
    }
  },
  deleteNotification:async()=>{
    try {
        set({isLoading:true});
        const res=await axios.delete("http://localhost:4005/api/notifications",{
            withCredentials:true,
        });
        set({notifications:null,isLoading:false})
    } catch (error) {
        console.log("Error deleting notifications :",err);
        set({error:err.message,isLoading:false})
    }
  },
  deleteSingle:async(Id)=>{
    try {
        set({isLoading:true});
        const res=await axios.delete(`http://localhost:4005/api/notifications/${Id}`,{
            withCredentials:true,
        });
        set({notifications:null,isLoading:false})
    } catch (error) {
        console.log("Error deleting notifications :",err);
        set({error:err.message,isLoading:false})
    }
  }
}))