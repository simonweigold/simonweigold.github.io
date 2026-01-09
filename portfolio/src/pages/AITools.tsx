import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

// Types
interface ToolRatings {
  accuracy: number;
  speed: number;
  easeOfUse: number;
  pricing: number;
  features: number;
}

interface Tool {
  id: string;
  name: string;
  company: string;
  description: string;
  link: string;
  ratings: ToolRatings;
  pricing: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  tools: Tool[];
}

interface RatingCategory {
  id: keyof ToolRatings;
  name: string;
  description: string;
}

interface AIToolsData {
  categories: Category[];
  ratingCategories: RatingCategory[];
}

// Tile item type for masonry
interface TileItem {
  type: 'category' | 'tool';
  category: Category;
  tool?: Tool;
}

function AITools() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    return savedMode || 'dark';
  });
  const [data, setData] = useState<AIToolsData | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedToolCategory, setSelectedToolCategory] = useState<Category | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Load data
  useEffect(() => {
    fetch('/ai-tools.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load AI map data:', err));
  }, []);

  // Build masonry tiles - category tiles followed by their tool tiles, filtered by search
  const tiles = useMemo((): TileItem[] => {
    if (!data) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const items: TileItem[] = [];
    
    data.categories.forEach((category) => {
      // Filter tools by search query
      const filteredTools = query
        ? category.tools.filter((tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.company.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            category.name.toLowerCase().includes(query)
          )
        : category.tools;
      
      // Only add category and tools if there are matching tools (or no search query)
      if (filteredTools.length > 0) {
        // Add category tile
        items.push({ type: 'category', category });
        // Add filtered tool tiles for this category
        filteredTools.forEach((tool) => {
          items.push({ type: 'tool', category, tool });
        });
      }
    });
    return items;
  }, [data, searchQuery]);

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
                background: { default: '#0F0F0F', paper: '#111111' },
                text: {
                  primary: '#ffffff',
                  secondary: '#dddddd',
                  disabled: 'rgba(255, 255, 255, 0.5)',
                },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
        },
      }),
    [mode]
  );

  const handleThemeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const getOverallRating = (ratings: ToolRatings): number => {
    const values = Object.values(ratings);
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const handleToolClick = (tool: Tool, category: Category) => {
    setSelectedTool(tool);
    setSelectedToolCategory(category);
  };

  const renderCategoryTile = (category: Category) => {
    const isHovered = hoveredTile === `cat-${category.id}`;
    
    return (
      <Box
        key={`cat-${category.id}`}
        onMouseEnter={() => setHoveredTile(`cat-${category.id}`)}
        onMouseLeave={() => setHoveredTile(null)}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: category.color,
          opacity: 0.95,
          p: 3,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isHovered 
            ? `0 8px 32px ${category.color}60`
            : `0 4px 16px ${category.color}30`,
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: '#fff',
            mb: 1,
          }}
        >
          {category.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.5,
          }}
        >
          {category.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${category.tools.length} tools`}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderToolTile = (tool: Tool, category: Category) => {
    const isHovered = hoveredTile === `tool-${tool.id}`;
    const overallRating = getOverallRating(tool.ratings);
    
    return (
      <Box
        key={`tool-${tool.id}`}
        onClick={() => handleToolClick(tool, category)}
        onMouseEnter={() => setHoveredTile(`tool-${tool.id}`)}
        onMouseLeave={() => setHoveredTile(null)}
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
          border: `2px solid ${category.color}40`,
          p: 2.5,
          pt: 3,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1)',
          boxShadow: isHovered 
            ? `0 12px 40px ${category.color}40`
            : `0 2px 8px rgba(0,0,0,0.1)`,
          '&:hover': {
            borderColor: category.color,
          },
        }}
      >
        {/* Color accent bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: category.color,
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              pr: 1,
            }}
          >
            {tool.name}
          </Typography>
          <Chip
            label={overallRating.toFixed(1)}
            size="small"
            sx={{
              backgroundColor: `${category.color}20`,
              color: category.color,
              fontWeight: 700,
              minWidth: 40,
            }}
          />
        </Box>
        
        <Typography 
          variant="caption" 
          sx={{ 
            color: category.color,
            fontWeight: 500,
            display: 'block',
            mb: 1,
          }}
        >
          {tool.company}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            mb: 1.5,
          }}
        >
          {tool.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tool.tags.slice(0, 2).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                backgroundColor: `${category.color}15`,
                color: category.color,
                border: `1px solid ${category.color}30`,
              }}
            />
          ))}
          <Chip
            label={tool.pricing}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: 'text.secondary',
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderToolDetail = () => {
    if (!selectedTool || !selectedToolCategory || !data) return null;

    return (
      <Fade in={true}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
          }}
          onClick={() => {
            setSelectedTool(null);
            setSelectedToolCategory(null);
          }}
        >
          <Paper
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              p: 4,
              borderRadius: 3,
              border: `2px solid ${selectedToolCategory.color}`,
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {selectedTool.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  by {selectedTool.company}
                </Typography>
              </Box>
              <IconButton onClick={() => {
                setSelectedTool(null);
                setSelectedToolCategory(null);
              }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {selectedTool.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Ratings
              </Typography>
              {data.ratingCategories.map((ratingCat) => (
                <Tooltip key={ratingCat.id} title={ratingCat.description} placement="left">
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{ratingCat.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedTool.ratings[ratingCat.id]}/5
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(selectedTool.ratings[ratingCat.id] / 5) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: selectedToolCategory.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Overall Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: selectedToolCategory.color }}>
                  {getOverallRating(selectedTool.ratings).toFixed(1)}
                </Typography>
                <Rating
                  value={getOverallRating(selectedTool.ratings)}
                  precision={0.1}
                  readOnly
                  sx={{
                    '& .MuiRating-iconFilled': { color: selectedToolCategory.color },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Pricing
              </Typography>
              <Chip
                label={selectedTool.pricing}
                sx={{
                  backgroundColor: `${selectedToolCategory.color}20`,
                  color: selectedToolCategory.color,
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedTool.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    sx={{ borderColor: selectedToolCategory.color, color: selectedToolCategory.color }}
                  />
                ))}
              </Box>
            </Box>

            <Box
              component="a"
              href={selectedTool.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: selectedToolCategory.color,
                color: '#fff',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textDecoration: 'none',
                fontWeight: 600,
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 20px ${selectedToolCategory.color}50`,
                },
              }}
            >
              Visit Website
              <OpenInNewIcon sx={{ fontSize: 18 }} />
            </Box>
          </Paper>
        </Box>
      </Fade>
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
              <IconButton component={Link} to="/" sx={{ color: 'text.secondary' }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                AI Map
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Brightness7Icon sx={{ color: mode === 'light' ? 'primary.main' : 'text.secondary' }} />
              <Switch checked={mode === 'dark'} onChange={handleThemeChange} color="secondary" />
              <Brightness4Icon sx={{ color: mode === 'dark' ? 'secondary.main' : 'text.secondary' }} />
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search tools by name, company, tags..."
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  },
                },
              }}
            />
          </Box>

          {/* Masonry Grid - Using CSS columns for true masonry with horizontal order simulation */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            {(() => {
              // Distribute tiles into 4 columns maintaining horizontal reading order
              const columnCount = 4;
              const columns: TileItem[][] = Array.from({ length: columnCount }, () => []);
              
              // Distribute items row by row (horizontally)
              tiles.forEach((item, index) => {
                const columnIndex = index % columnCount;
                columns[columnIndex].push(item);
              });

              return columns.map((columnItems, colIndex) => (
                <Box
                  key={`column-${colIndex}`}
                  sx={{
                    flex: 1,
                    flexDirection: 'column',
                    gap: 2,
                    // Hide columns on smaller screens
                    display: { 
                      xs: colIndex === 0 ? 'flex' : 'none',
                      sm: colIndex < 2 ? 'flex' : 'none',
                      md: colIndex < 3 ? 'flex' : 'none',
                      lg: 'flex'
                    },
                  }}
                >
                  {columnItems.map((item) =>
                    item.type === 'category'
                      ? renderCategoryTile(item.category)
                      : renderToolTile(item.tool!, item.category)
                  )}
                </Box>
              ));
            })()}
          </Box>

          {/* Tool Detail Modal */}
          {selectedTool && renderToolDetail()}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AITools;
