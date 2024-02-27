import { useEffect, useState } from 'react';
import { AppBar, Badge, Box, Divider, Drawer, IconButton, ListItemButton, List, ListItem, ListItemIcon, ListItemText, Theme, Toolbar, Typography, useTheme, Avatar, Menu, MenuItem } from '@mui/material'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Logout } from '@mui/icons-material';
import routes from '@/lib/routes';
import Link from "next/link";
import { DefaultProps } from '@/lib/types';
import { useRouter } from 'next/router';
import sideBar from '@/lib/data/sideBar';
import { signOut } from 'next-auth/react';

const drawerWidth = 200;

const openedMixin = (theme: Theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});



export default function Dashboard({ children }: DefaultProps): JSX.Element {
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false)
    const handleDrawerOpen = () => { setOpen(true) }
    const handleDrawerClose = () => { setOpen(false) }
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openAnchor = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget) }
    const handleClose = () => { setAnchorEl(null); }
    const router = useRouter();
    const selected = router.pathname
    const slashPosition = selected.lastIndexOf("/")
    const title = slashPosition === selected.length - 1 ? "Dashboard" : `${selected[slashPosition + 1].toUpperCase()}${selected.slice(slashPosition + 2)}`
    useEffect(() => { document.title = title }, [title])


    const appBarStyles = {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }
    const drawerStyles = {
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open ? {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        } : {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        })
    }

    return <>
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={appBarStyles}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component={Link} href={routes.home} variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}
                    >
                        {process.env.REACT_APP_APP_NAME}
                    </Typography>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}
                    >
                        {title}
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={0} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openAnchor ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openAnchor ? 'true' : undefined}
                    >
                        <Avatar alt="" src="" sx={{ width: 24, height: 24 }} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openAnchor}
                        onClose={handleClose}
                        onClick={handleClose}
                        elevation={0}
                        sx={{
                            "& .MuiMenu-paper": {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={e => { signOut() }}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" sx={drawerStyles} >
                <Typography sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: theme.spacing(0, 1),
                    ...theme.mixins.toolbar,
                }}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </Typography>
                <Divider />
                <List>
                    {sideBar.slice(0, 4).map((item, i) => (
                        <ListItem key={i} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton component={Link} href={item.link} selected={selected.includes(item.label.toLowerCase())}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {<item.icon />}
                                </ListItemIcon>
                                <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {sideBar.slice(4).map((item, i) => (
                        <ListItem key={i} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton component={Link} href={item.link} selected={selected.includes(item.label.toLowerCase())}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {<item.icon />}
                                </ListItemIcon>
                                <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: theme.spacing(0, 1),
                    ...theme.mixins.toolbar,
                }} />
                {children}
                <Footer />
            </Box>
        </Box>
    </>
}


const Copyright = () => <>
    <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href={routes.home}>
            {process.env.REACT_APP_APP_NAME}
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
</>

const Footer = () => {

    return <>
        <Copyright />
    </>
}
