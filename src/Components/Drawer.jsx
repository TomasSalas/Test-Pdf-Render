import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import LogoRakin2 from '../assets/logot.png'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Backdrop from '@mui/material/Backdrop'
import { Menu, MenuItem, Typography } from '@mui/material'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import GroupsIcon from '@mui/icons-material/Groups'
import ConstructionIcon from '@mui/icons-material/Construction'
import AddAlertIcon from '@mui/icons-material/AddAlert'
import SmsFailedIcon from '@mui/icons-material/SmsFailed'
import CreateIcon from '@mui/icons-material/Create'
import LogoutIcon from '@mui/icons-material/Logout'
import RequestPageIcon from '@mui/icons-material/RequestPage'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'

export default function PermanentDrawerLeft({ Nombre, Role }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  let Rutas = []

  if (Role === '3') {
    Rutas = [
      {
        name: 'Gestión Usuario',
        path: '/usuarios',
        icon: (
          <box-icon
            name='user'
            color={location.pathname === '/usuarios' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Planificar Proceso',
        path: '/planificar',
        icon: (
          <box-icon
            name='grid'
            color={location.pathname === '/planificar' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Buscar Planificación',
        path: '/ver-planificacion',
        icon: (
          <box-icon
            name='list-ol'
            color={location.pathname === '/ver-planificacion' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      }
    ]
  } else if (Role === '2') {
    Rutas = [
      {
        name: 'Gestión Perfiles',
        path: '/perfiles',
        icon: (
          <AssignmentIndIcon
            color={location.pathname === '/perfiles' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión UCL',
        path: '/ucls',
        icon: (
          <WorkspacesIcon
            color={location.pathname === '/ucls' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      }, {
        name: 'Gestión Relación',
        path: '/perfil-ucls',
        icon: (
          <GroupsIcon
            color={location.pathname === '/perfil-ucls' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Instrumentos',
        path: '/instrumentos',
        icon: (
          <ConstructionIcon
            color={location.pathname === '/instrumentos' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Actividad',
        path: '/actividad',
        icon: (
          <AddAlertIcon
            color={location.pathname === '/actividad' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Criterio',
        path: '/criterio',
        icon: (
          <SmsFailedIcon
            color={location.pathname === '/criterio' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Detalle Instrumento',
        path: '/detalle-instrumento',
        icon: (
          <CreateIcon
            color={location.pathname === '/detalle-instrumento' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Auditoria Instrumento',
        path: '/auditoria-instrumento',
        icon: (
          <ShieldOutlinedIcon
            color={location.pathname === '/auditoria-instrumento' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      }
    ]
  } else if (Role === '5') {
    Rutas = [
      {
        name: 'Gestión Mutual',
        path: '/mutuarias',
        icon: (
          <box-icon
            name='briefcase'
            color={location.pathname === '/mutuarias' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Sucursal',
        path: '/sucursal',
        icon: (
          <box-icon
            name='store-alt'
            color={location.pathname === '/sucursal' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Cliente',
        path: '/clientes',
        icon: (
          <box-icon
            name='buildings'
            color={location.pathname === '/clientes' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Contratos',
        path: '/contrato',
        icon: (
          <RequestPageIcon
            color={location.pathname === '/contrato' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      },
      {
        name: 'Gestión Detalle Contratos',
        path: '/detalle-contrato',
        icon: (
          <FindInPageIcon
            color={location.pathname === '/detalle-contrato' ? 'rgba(220,0, 0, 1)' : 'black'}
          />
        )
      }
    ]
  }

  const toggleDrawer = () => {
    if (isMdUp) {
      setOpen(!open)
    } else {
      setMobileOpen(!mobileOpen)
    }
  }

  const handleListItemClick = (path) => {
    if (!isMdUp) {
      setMobileOpen(false)
    }
    if (location.pathname === path) {
      if (!isMdUp) {
        setMobileOpen(false)
      }
    }
  }

  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
    event.stopPropagation()
  }

  const handleMenuClose = (event) => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    navigate('/')
    handleMenuClose()
  }

  const drawerWidthOpen = 208

  useEffect(() => {
    if (isMdUp) {
      setOpen(true)
      setMobileOpen(false)
    } else {
      setOpen(false)
    }
  }, [location.pathname, isMdUp])

  const drawerContent = (
    <Box sx={{ display: 'flex', paddingLeft: isMdUp && 3, justifyContent: !isMdUp ? 'center' : 'space-between', alignItems: 'center', height: 64, width: '100%' }}>
      <img src={LogoRakin2} width={110} alt='Logo' />
      {isMdUp && (
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
            padding: 0,
            borderRadius: 2,
            cursor: 'pointer'
          }}
        >
          <Typography variant='body1'> {Nombre} </Typography>
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ marginTop: 1, padding: 10 }}
      >
        <MenuItem sx={{ padding: 1, gap: 1 }} onClick={handleLogout}>
          <LogoutIcon color='error' /> Cerrar sesión
        </MenuItem>
      </Menu>
    </Box>
  )

  const drawer = (
    <Drawer
      sx={{
        width: drawerWidthOpen,
        flexShrink: 0,
        margin: 0,
        padding: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidthOpen,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          borderRight: 'none',
          boxShadow: open ? '0px 4px 4px rgba(0, 0, 0, 0.15)' : 'none',
          top: isMdUp && '63px'
        }
      }}
      variant={isMdUp ? 'permanent' : 'temporary'}
      anchor='left'
      onClick={toggleDrawer}
      open={isMdUp || mobileOpen}
      ModalProps={{ keepMounted: true }}
    >

      {!isMdUp && drawerContent}
      <List sx={{ paddingTop: 0 }}>
        {Rutas.map((text, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(220,0,0,0.03)',
                '& .MuiListItemIcon-root': {
                  color: 'rgba(220,0, 0, 1)'
                },
                '& .MuiListItemText-root': {
                  color: 'rgba(220,0, 0, 1)'
                }
              },
              '&:active': {
                transition: 'background-color 0.2s ease-in-out'
              },
              padding: 0
            }}
          >
            <ListItemButton
              disableTouchRipple
              component={Link}
              to={text.path}
              onClick={() => handleListItemClick(text.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0)'
                },
                color: location.pathname === text.path ? 'rgba(220,0, 0, 1)' : 'black',
                borderRight: location.pathname === text.path ? 2 : 'none',
                fontSize: '0.875rem'
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === text.path
                    ? 'rgba(220,0, 0, 1)'
                    : 'black',
                  transition: 'color 0.3s'
                }}
              >
                {text.icon}
              </ListItemIcon>
              <ListItemText
                primary={text.name}
                primaryTypographyProps={{ fontSize: '14px' }}
                sx={{
                  color: location.pathname === text.path
                    ? 'rgba(220,0, 0, 1)'
                    : 'black',
                  transition: 'color 0.3s',
                  display: open ? 'block' : ''
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: '100%',
          ml: isMdUp ? `${open && drawerWidthOpen}px` : 0,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          color: 'black'
        }}
      >
        <Toolbar sx={{ backgroundColor: 'white', height: 64 }}>
          {!isMdUp
            ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box>
                  <IconButton
                    aria-label='open drawer'
                    edge='start'
                    onClick={!isMdUp && toggleDrawer}
                    sx={{ mr: 2, mt: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>

                <Box
                  onClick={handleMenuOpen} sx={{

                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 2,
                    cursor: 'pointer'
                  }}
                >
                  <Typography> {Nombre} </Typography>
                </Box>
              </Box>)
            : (isMdUp && drawerContent)}
        </Toolbar>
      </AppBar>
      {drawer}
      {!isMdUp && (
        <Backdrop
          open={mobileOpen}
          sx={{
            zIndex: theme.zIndex.drawer - 1
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </Box>
  )
}
