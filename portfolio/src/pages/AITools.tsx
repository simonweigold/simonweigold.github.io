import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

// Types
interface Tool {
  id: string;
  name: string;
  company: string;
  description: string;
  link: string;
  pricing: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  tools: Tool[];
}

interface AIToolsData {
  categories: Category[];
}

function AITools() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    return savedMode || 'dark';
  });
  const [data, setData] = useState<AIToolsData | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<100 | 150>(() => {
    const savedZoom = localStorage.getItem('zoomLevel');
    return savedZoom === '150' ? 150 : 100;
  });

  // Detect if screen is wide enough for zoom controls (md breakpoint = 900px)
  const isWideScreen = useMediaQuery('(min-width:900px)');

  // On mobile, always use 100% zoom
  const effectiveZoom = isWideScreen ? zoomLevel : 100;

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('zoomLevel', String(zoomLevel));
  }, [zoomLevel]);

  // Load data
  useEffect(() => {
    fetch('/ai-tools.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load AI map data:', err));
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#673ab7' },
                secondary: { main: '#7A67E0' },
                background: { default: '#fafafa', paper: '#ffffff' },
                text: {
                  primary: 'rgba(0, 0, 0, 0.87)',
                  secondary: '#343434',
                  disabled: 'rgba(0, 0, 0, 0.38)',
                },
              }
            : {
                primary: { main: '#7A67E0' },
                secondary: { main: '#A99CFF' },
                background: { default: '#0a0a0a', paper: '#111111' },
                text: {
                  primary: '#e0e0e0',
                  secondary: '#a0a0a0',
                  disabled: 'rgba(255, 255, 255, 0.4)',
                },
              }),
        },
        typography: {
          fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
        },
      }),
    [mode]
  );

  // Calculate zoom scale (uses effectiveZoom which respects screen size)
  const scale = effectiveZoom / 100;

  const handleThemeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const renderCategoryTile = (category: Category) => {
    const isHovered = hoveredTile === `cat-${category.id}`;
    
    return (
      <Box
        key={`cat-${category.id}`}
        onMouseEnter={() => setHoveredTile(`cat-${category.id}`)}
        onMouseLeave={() => setHoveredTile(null)}
        sx={{
          borderRadius: 0,
          overflow: 'hidden',
          border: `1px solid ${category.color}`,
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)',
          p: effectiveZoom === 150 ? 3 : 2,
          transition: 'all 0.2s ease',
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          boxShadow: isHovered 
            ? `0 0 20px ${category.color}40, inset 0 0 20px ${category.color}10`
            : 'none',
          position: 'relative',
          '&::before': {
            content: '">"',
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: category.color,
            fontWeight: 700,
            fontSize: effectiveZoom === 150 ? '1.8rem' : '1.2rem',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: isHovered ? 3 : 0, transition: 'padding 0.2s ease' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: category.color,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: effectiveZoom === 150 ? '1.5rem' : '1.25rem',
            }}
          >
            [{category.name}]
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'text.secondary',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: effectiveZoom === 150 ? '1.1rem' : '0.75rem',
            mt: 0.5,
            pl: isHovered ? 3 : 0,
            transition: 'padding 0.2s ease',
          }}
        >
          // {category.description}
        </Typography>
      </Box>
    );
  };

  const renderToolTile = (tool: Tool, category: Category, isLast: boolean) => {
    const isHovered = hoveredTile === `tool-${tool.id}`;
    
    return (
      <Box
        key={`tool-${tool.id}`}
        sx={{
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* Tree connector - vertical line */}
        <Box
          sx={{
            width: effectiveZoom === 150 ? 32 : 24,
            flexShrink: 0,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 8,
              top: 0,
              bottom: 0,
              width: effectiveZoom === 150 ? 3 : 2,
              backgroundColor: category.color,
              opacity: 0.4,
            },
          }}
        />
        
        {/* Tool content */}
        <Box
          component="div"
          onMouseEnter={() => setHoveredTile(`tool-${tool.id}`)}
          onMouseLeave={() => setHoveredTile(null)}
          sx={{
            flex: 1,
            position: 'relative',
            borderRadius: 0,
            overflow: 'hidden',
            backgroundColor: mode === 'dark' ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.95)',
            border: `1px solid ${isHovered ? category.color : 'rgba(255,255,255,0.15)'}`,
            p: effectiveZoom === 150 ? 3 : 2,
            transition: 'all 0.2s ease',
            cursor: 'default',
            boxShadow: isHovered 
              ? `0 0 15px ${category.color}30`
              : 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: effectiveZoom === 150 ? 3 : 2,
              backgroundColor: category.color,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
            },
          }}
        > 
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Typography 
              sx={{ 
                fontWeight: 700, 
                color: category.color,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: effectiveZoom === 150 ? '1.4rem' : '0.95rem',
              }}
            >
              $ {tool.name}
            </Typography>
            <Chip
              label={tool.pricing}
              size="small"
              sx={{
                height: effectiveZoom === 150 ? 26 : 18,
                fontSize: effectiveZoom === 150 ? '0.9rem' : '0.6rem',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                backgroundColor: 'transparent',
                border: `1px solid ${category.color}50`,
                color: category.color,
                borderRadius: 0,
              }}
            />
          </Box>
          
          <Typography 
            sx={{ 
              color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'text.secondary',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: effectiveZoom === 150 ? '1.05rem' : '0.7rem',
              mb: 1,
            }}
          >
            @{tool.company}
          </Typography>
          
          <Typography 
            sx={{ 
              color: mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'text.secondary',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: effectiveZoom === 150 ? '1.1rem' : '0.75rem',
              lineHeight: 1.7,
              mb: 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {tool.description}
          </Typography>
          
          <Box
            component="a"
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              border: `1px solid ${category.color}`,
              borderRadius: 0,
              color: category.color,
              backgroundColor: 'transparent',
              px: effectiveZoom === 150 ? 3 : 2,
              py: effectiveZoom === 150 ? 1 : 0.75,
              textDecoration: 'none',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: effectiveZoom === 150 ? '1.05rem' : '0.7rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: category.color,
                color: '#000',
                boxShadow: `0 0 10px ${category.color}`,
              },
            }}
          >
            {'>'} OPEN_LINK
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                component={Link} 
                to="/" 
                sx={{ 
                  color: mode === 'dark' ? '#e0e0e0' : 'text.secondary',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  color: mode === 'dark' ? '#e0e0e0' : 'text.primary',
                }}
              >
                ./AI_MAP
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Zoom Controls - only visible on larger screens */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 0.5 
              }}>
                <Box
                  onClick={() => setZoomLevel(100)}
                  sx={{
                    px: 1,
                    py: 0.5,
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                    borderRadius: 0,
                    cursor: 'pointer',
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: '0.7rem',
                    color: zoomLevel === 100 
                      ? (mode === 'dark' ? '#000' : '#fff')
                      : (mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'text.secondary'),
                    backgroundColor: zoomLevel === 100 
                      ? (mode === 'dark' ? '#e0e0e0' : '#333')
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: zoomLevel === 100 
                        ? (mode === 'dark' ? '#e0e0e0' : '#333')
                        : (mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                    },
                  }}
                >
                  100%
                </Box>
                <Box
                  onClick={() => setZoomLevel(150)}
                  sx={{
                    px: 1,
                    py: 0.5,
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                    borderRadius: 0,
                    cursor: 'pointer',
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: '0.7rem',
                    color: zoomLevel === 150 
                      ? (mode === 'dark' ? '#000' : '#fff')
                      : (mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'text.secondary'),
                    backgroundColor: zoomLevel === 150 
                      ? (mode === 'dark' ? '#e0e0e0' : '#333')
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: zoomLevel === 150 
                        ? (mode === 'dark' ? '#e0e0e0' : '#333')
                        : (mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                    },
                  }}
                >
                  150%
                </Box>
              </Box>
              {/* Theme Toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Brightness7Icon sx={{ color: mode === 'light' ? 'primary.main' : 'rgba(255,255,255,0.5)' }} />
                <Switch checked={mode === 'dark'} onChange={handleThemeChange} color="secondary" />
                <Brightness4Icon sx={{ color: mode === 'dark' ? '#e0e0e0' : 'text.secondary' }} />
              </Box>
            </Box>
          </Box>

          {/* Search Bar and Category Filter */}
          <Box sx={{ mb: 4, maxWidth: 700, mx: 'auto', display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              placeholder="Search tools by name, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                  backgroundColor: mode === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(0,0,0,0.03)',
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(40,40,40,0.8)' : 'rgba(0,0,0,0.05)',
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: mode === 'dark' ? 'rgba(50,50,50,0.8)' : 'rgba(0,0,0,0.05)',
                    borderColor: mode === 'dark' ? '#e0e0e0' : 'primary.main',
                    boxShadow: mode === 'dark' ? '0 0 10px rgba(255,255,255,0.1)' : 'none',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& input': {
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.85rem',
                },
                '& input::placeholder': {
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  opacity: 0.6,
                },
              }}
            />
            <Select
              value={selectedCategory}
              onChange={(e: SelectChangeEvent) => setSelectedCategory(e.target.value)}
              displayEmpty
              sx={{
                minWidth: { xs: '100%', sm: 180 },
                borderRadius: 0,
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                backgroundColor: mode === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(0,0,0,0.03)',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '0.85rem',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(40,40,40,0.8)' : 'rgba(0,0,0,0.05)',
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
                '&.Mui-focused': {
                  backgroundColor: mode === 'dark' ? 'rgba(50,50,50,0.8)' : 'rgba(0,0,0,0.05)',
                  borderColor: mode === 'dark' ? '#e0e0e0' : 'primary.main',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiSelect-select': {
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.85rem',
                },
                '& .MuiSelect-icon': {
                  color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 0,
                    backgroundColor: mode === 'dark' ? '#1a1a1a' : '#fff',
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                    '& .MuiMenuItem-root': {
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      fontSize: '0.85rem',
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {data?.categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: category.color,
                        flexShrink: 0,
                      }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Terminal-style Tree Layout */}
          <Box
            sx={{
              maxWidth: effectiveZoom === 150 ? 1100 : 900,
              mx: 'auto',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              '--base-font': effectiveZoom === 150 ? '1.125rem' : '0.75rem',
              '--title-font': effectiveZoom === 150 ? '1.4rem' : '0.95rem',
              '--small-font': effectiveZoom === 150 ? '1rem' : '0.7rem',
              '--tiny-font': effectiveZoom === 150 ? '0.9rem' : '0.6rem',
              '--spacing': effectiveZoom === 150 ? 3 : 2,
            }}
          >
            {/* Terminal header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                pb: 1,
                borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    fontSize: `${0.75 * scale}rem`,
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  }}
                >
                  user@localhost:~$
                </Typography>
                <Typography
                  sx={{
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                    fontSize: `${0.75 * scale}rem`,
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  }}
                >
                  ./ai-map --list --verbose
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                    fontSize: '0.6rem',
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                    cursor: 'default',
                    '&:hover': {
                      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  _
                </Box>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                    fontSize: '0.6rem',
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                    cursor: 'default',
                    '&:hover': {
                      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  □
                </Box>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                    fontSize: '0.6rem',
                    color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                    cursor: 'default',
                    '&:hover': {
                      backgroundColor: 'rgba(255,0,0,0.3)',
                      borderColor: 'rgba(255,0,0,0.5)',
                    },
                  }}
                >
                  ×
                </Box>
              </Box>
            </Box>

            {/* Categories and Tools Tree */}
            {data?.categories
              .filter((category) => {
                // First, filter by selected category
                if (selectedCategory !== 'all' && category.id !== selectedCategory) {
                  return false;
                }
                
                // Then, filter by search query
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true;
                const hasMatchingTools = category.tools.some(
                  (tool) =>
                    tool.name.toLowerCase().includes(query) ||
                    tool.company.toLowerCase().includes(query) ||
                    tool.description.toLowerCase().includes(query) ||
                    category.name.toLowerCase().includes(query)
                );
                return hasMatchingTools;
              })
              .map((category, catIndex, filteredCategories) => {
                const query = searchQuery.toLowerCase().trim();
                const filteredTools = query
                  ? category.tools.filter(
                      (tool) =>
                        tool.name.toLowerCase().includes(query) ||
                        tool.company.toLowerCase().includes(query) ||
                        tool.description.toLowerCase().includes(query) ||
                        category.name.toLowerCase().includes(query)
                    )
                  : category.tools;

                return (
                  <Box key={category.id} sx={{ mb: 3 }}>
                    {/* Category */}
                    {renderCategoryTile(category)}
                    
                    {/* Tools */}
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {filteredTools.map((tool, toolIndex) =>
                        renderToolTile(tool, category, toolIndex === filteredTools.length - 1)
                      )}
                    </Box>
                  </Box>
                );
              })}

            {/* Terminal cursor */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 4,
                color: mode === 'dark' ? '#e0e0e0' : 'text.primary',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: `${0.85 * scale}rem`,
              }}
            >
              <span style={{ color: mode === 'dark' ? '#8be9fd' : '#0066cc' }}>user@localhost</span>
              <span style={{ color: mode === 'dark' ? '#e0e0e0' : '#333' }}>:</span>
              <span style={{ color: mode === 'dark' ? '#bd93f9' : '#6a0dad' }}>~</span>
              <span style={{ color: mode === 'dark' ? '#e0e0e0' : '#333' }}>$</span>
              <Box
                sx={{
                  width: 8 * scale,
                  height: 16 * scale,
                  backgroundColor: mode === 'dark' ? '#e0e0e0' : 'text.primary',
                  animation: 'blink 1s step-end infinite',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                  },
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AITools;
