import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
   try {
    const userId = req.user._id; // Assuming user ID is stored in req.user after authentication
    const notifications = await Notification.find({to: userId}).populate({
        path: "from",
        select: "username profileImg", // Exclude sensitive fields
    });

    await Notification.updateMany(
        {to:userId}, {read: true},
    );

    res.status(200).json(notifications);
   } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
   }
}

export const deleteNotifications = async (req, res) => {
   try {
    const userId= req.user._id; // Assuming user ID is stored in req.user after authentication
    await Notification.deleteMany({to: userId});
    res.status(200).json({
      success: true,
      message: "Notifications deleted successfully",
    });
    
   } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
      error: error.message,
    }); 
   }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId=req.params.id; // Assuming notification ID is passed as a URL parameter
        const userId=req.user._id;
        const notification = await Notification.findOneAndDelete({_id: notificationId});
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        // Optionally, you can check if the notification belongs to the user
        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this notification",
            });
        }

        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete notification",
            error: error.message,
        });
    }

}
