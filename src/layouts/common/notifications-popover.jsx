// import { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';
// import Pagination from '@mui/material/Pagination';
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import Badge from '@mui/material/Badge';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
// import Tooltip from '@mui/material/Tooltip';
// import Popover from '@mui/material/Popover';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';

// import { fToNow } from 'src/utils/format-time';

// import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';
// import { BACKEND_URL } from 'src/config/config';

// // ----------------------------------------------------------------------

// export default function NotificationsPopover(
//   {
//     // notificationData,
//     // setNotificationData,
//     // getAllUserNotificationData,
//     // setPage,
//   }
// ) {
//   // const [totalUnRead, setTotalUnread] = useState(0);

//   // const [open, setOpen] = useState(null);

//   // const handleOpen = (event) => {
//   //   setOpen(event.currentTarget);
//   // };

//   // useEffect(() => {
//   //   setTotalUnread(notificationData.totalUnseenDocuments);
//   // }, [notificationData]);

//   // const handleClose = () => {
//   //   setOpen(null);
//   // };

//   // const markAllAsRead = async (roleValue) => {
//   //   const user = JSON.parse(localStorage.getItem('access_token'));
//   //   const { token } = user;
//   //   const headers = { Authorization: `${token}` };

//   //   try {
//   //     await axios.put(`${BACKEND_URL}/api/user/markNotificationAsRead?userType=ADMIN`, null, {
//   //       headers: headers,
//   //     });
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // const handleMarkAllAsRead = () => {
//   //   const notificationDatas = notificationData && notificationData.data;
//   //   if (notificationDatas.length) {
//   //     const finalArray = notificationDatas.map((notification) => ({
//   //       ...notification,
//   //       isSeen: true,
//   //     }));
//   //     setNotificationData((prevNotificationData) => ({
//   //       ...prevNotificationData,
//   //       totalUnseenDocuments: 0,
//   //       data: finalArray,
//   //     }));
//   //     setTotalUnread(0);

//   //     markAllAsRead();
//   //   }
//   // };

//   // const handleChange = (event, value) => {
//   //   setPage(value);
//   //   getAllUserNotificationData(value);
//   // };
//   return (
//     <>
//       {/* <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}> */}
//       <IconButton color={open ? 'primary' : 'default'}>
//         <Badge badgeContent="10" color="error">
//           <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
//         </Badge>
//       </IconButton>

//       <Popover
//         // open={!!open}
//         // anchorEl={open}
//         // // onClose={handleClose}
//         // anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//         // PaperProps={{
//         //   sx: {
//         //     mt: 1.5,
//         //     ml: 0.75,
//         //     width: 360,
//         //   },
//         // }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
//           {/* <Box sx={{ flexGrow: 1 }}>
//             <Typography variant="subtitle1">Notifications</Typography>
//             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//               You have 10 unread messages
//             </Typography>
//           </Box> */}

//           {/* {totalUnRead > 0 && (
//             <Tooltip title=" Mark all as read">
//               <IconButton color="primary" onClick={handleMarkAllAsRead}>
//                 <Iconify icon="eva:done-all-fill" />
//               </IconButton>
//             </Tooltip>
//           )} */}
//         </Box>

//         <Divider sx={{ borderStyle: 'dashed' }} />

//         <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
//           <List disablePadding>
//             {/* {notificationData &&
//               notificationData.data &&
//               notificationData.data.map((notification) => (
//                 <NotificationItem key={notification.id} notification={notification} />
//               ))} */}
//           </List>
//         </Scrollbar>

//         <Divider sx={{ borderStyle: 'dashed' }} />

//         <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
//           {/* <Pagination
//             count={Math.ceil(notificationData.totalDocuments / 30)}
//             onChange={handleChange}
//           /> */}
//         </Box>
//       </Popover>
//     </>
//   );
// }

// // ----------------------------------------------------------------------

// NotificationItem.propTypes = {
//   notification: PropTypes.shape({
//     createdAt: PropTypes.instanceOf(Date),
//     id: PropTypes.string,
//     isSeen: PropTypes.bool,
//     title: PropTypes.string,
//     text: PropTypes.string,
//     type: PropTypes.string,
//     avatar: PropTypes.any,
//   }),
// };

// function NotificationItem({ notification }) {
//   // const { avatar, title } = renderContent(notification);

//   return (
//     <ListItemButton
//       sx={{
//         py: 1.5,
//         px: 2.5,
//         mt: '1px',
//         ...(notification.isSeen && {
//           bgcolor: 'action.selected',
//         }),
//       }}
//     >
//       <ListItemAvatar>
//         <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
//       </ListItemAvatar>
//       <ListItemText
//         primary={'Notification'}
//         secondary={
//           <Typography
//             variant="caption"
//             sx={{
//               mt: 0.5,
//               display: 'flex',
//               alignItems: 'center',
//               color: 'text.disabled',
//             }}
//           >
//             <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
//             {/* {fToNow(notification.createdAt)} */}
//           </Typography>
//         }
//       />
//     </ListItemButton>
//   );
// }

// // ----------------------------------------------------------------------

// // function renderContent(notification) {
// //   console.log(notification);
// //   const title = (
// //     <Typography variant="subtitle2">
// //       {notification.title}
// //       <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
// //         &nbsp; {notification.text}
// //       </Typography>
// //     </Typography>
// //   );

// //   if (notification && notification.text.toLowerCase().includes('installation')) {
// //     return {
// //       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
// //       title,
// //     };
// //   }
// //   if (notification && notification.text.toLowerCase().includes('service')) {
// //     return {
// //       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
// //       title,
// //     };
// //   }
// //   if (notification && notification.text.toLowerCase().includes('onboarded')) {
// //     return {
// //       avatar: <img alt={notification.title} src="/assets/images/avatars/avatar_2.jpg" />,
// //       title,
// //     };
// //   }
// //   if (notification.type === 'mail') {
// //     return {
// //       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
// //       title,
// //     };
// //   }
// //   if (notification && notification.text.toLowerCase().includes('ticket')) {
// //     return {
// //       avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
// //       title,
// //     };
// //   }
// //   return {
// //     avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
// //     title,
// //   };
// // }

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { BACKEND_URL } from 'src/config/config';
import { fToNow } from 'src/utils/format-time';
import { userRequest } from 'src/requestMethod';

// ----------------------------------------------------------------------

export default function NotificationsPopover({ notificationData }) {
  const [totalUnRead, setTotalUnread] = useState(0);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const notificationCount = async () => {
    try {
      const res = await userRequest.get('/admin/getUnreadCount');
      setTotalUnread(res?.data?.data?.unreadCount);
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    notificationCount();
  }, []);

  const handleClose = () => {
    setOpen(null);
  };

  const handleChange = (event, value) => {
    setPage(value);
    getAllUserNotificationData(value);
  };
  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            {notificationData &&
              notificationData.data.map((notification) => (
                <NotificationItem key={notification._id} notification={notification} />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(notificationData.totalDocuments / 30)}
            onChange={handleChange}
          />
        </Box> */}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isSeen: PropTypes.bool,
    title: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.status && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function renderContent(notification) {
  console.log(notification);
  const title = (
    <Typography variant="subtitle2">
      {notification.reason}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.email} &nbsp; submitted {notification?.reason}
      </Typography>
    </Typography>
  );

  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
