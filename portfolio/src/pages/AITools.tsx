import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import Zoom from '@mui/material/Zoom';
import { Link } from 'react-router-dom';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';

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

// Graph node types
interface GraphNode extends SimulationNodeDatum {
  id: string;
  name: string;
  type: 'center' | 'category' | 'tool';
  color: string;
  radius: number;
  data?: Category | Tool;
  parentId?: string;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  color: string;
}

function AITools() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    return savedMode || 'dark';
  });
  const [data, setData] = useState<AIToolsData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<ReturnType<typeof forceSimulation<GraphNode>> | null>(null);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.min(rect.width, 1000),
          height: Math.min(600, window.innerHeight - 300),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Load data
  useEffect(() => {
    fetch('/ai-tools.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load AI tools data:', err));
  }, []);

  // Build and simulate graph
  useEffect(() => {
    if (!data || selectedCategory) return;

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create nodes
    const graphNodes: GraphNode[] = [
      {
        id: 'center',
        name: 'AI Tools',
        type: 'center',
        color: '#7A67E0',
        radius: 60,
        x: centerX,
        y: centerY,
        fx: centerX, // Fixed position for center
        fy: centerY,
      },
    ];

    const graphLinks: GraphLink[] = [];

    data.categories.forEach((category) => {
      graphNodes.push({
        id: category.id,
        name: category.name,
        type: 'category',
        color: category.color,
        radius: 50,
        data: category,
      });

      graphLinks.push({
        source: 'center',
        target: category.id,
        color: category.color,
      });
    });

    // Create force simulation
    const simulation = forceSimulation<GraphNode>(graphNodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(graphLinks)
          .id((d) => d.id)
          .distance(180)
          .strength(0.8)
      )
      .force('charge', forceManyBody().strength(-800))
      .force('center', forceCenter(centerX, centerY))
      .force(
        'collision',
        forceCollide<GraphNode>().radius((d) => d.radius + 20)
      )
      .alphaDecay(0.02);

    simulationRef.current = simulation;

    // Update state on each tick
    simulation.on('tick', () => {
      setNodes([...graphNodes]);
      setLinks([...graphLinks]);
    });

    // Run simulation for a bit then stop
    simulation.alpha(1).restart();

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, selectedCategory]);

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

  const paperCutShadow =
    mode === 'dark' ? '2px 2px 2px rgba(15, 15, 15, 0.3)' : '2px 2px 2px rgba(50, 50, 50, 0.1)';

  const getOverallRating = (ratings: ToolRatings): number => {
    const values = Object.values(ratings);
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.type === 'category' && node.data) {
      setSelectedCategory(node.data as Category);
    }
  }, []);

  const renderForceGraph = () => {
    const { width, height } = dimensions;

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Links */}
        {links.map((link, index) => {
          const sourceNode = typeof link.source === 'object' ? link.source : null;
          const targetNode = typeof link.target === 'object' ? link.target : null;

          if (!sourceNode || !targetNode || sourceNode.x == null || targetNode.x == null) {
            return null;
          }

          const isHovered = hoveredNode === targetNode.id;

          return (
            <line
              key={index}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={link.color}
              strokeWidth={isHovered ? 4 : 2}
              strokeOpacity={isHovered ? 1 : 0.4}
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          if (node.x == null || node.y == null) return null;

          const isHovered = hoveredNode === node.id;
          const isCenter = node.type === 'center';
          const scale = isHovered && !isCenter ? 1.15 : 1;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y}) scale(${scale})`}
              style={{
                cursor: node.type === 'category' ? 'pointer' : 'default',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Glow effect */}
              <defs>
                <filter id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={isHovered ? 8 : 4} result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id={`gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={node.color} stopOpacity={isCenter ? 1 : 0.3} />
                  <stop offset="100%" stopColor={node.color} stopOpacity={isCenter ? 0.8 : 0.6} />
                </linearGradient>
              </defs>

              {/* Node circle */}
              <circle
                r={node.radius}
                fill={`url(#gradient-${node.id})`}
                stroke={node.color}
                strokeWidth={isCenter ? 0 : 3}
                filter={isHovered ? `url(#glow-${node.id})` : undefined}
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* Node text */}
              <text
                textAnchor="middle"
                dy={isCenter ? -8 : 0}
                fill={mode === 'dark' ? '#fff' : isCenter ? '#fff' : node.color}
                fontSize={isCenter ? 16 : 11}
                fontWeight={700}
                style={{ pointerEvents: 'none' }}
              >
                {node.name.length > 12 ? (
                  <>
                    <tspan x="0" dy={isCenter ? 0 : -6}>
                      {node.name.split(' ')[0] || node.name.substring(0, 10)}
                    </tspan>
                    <tspan x="0" dy={14}>
                      {node.name.split(' ').slice(1).join(' ') || ''}
                    </tspan>
                  </>
                ) : (
                  node.name
                )}
              </text>

              {/* Subtitle for center */}
              {isCenter && (
                <text
                  textAnchor="middle"
                  dy={12}
                  fill="rgba(255,255,255,0.8)"
                  fontSize={10}
                  style={{ pointerEvents: 'none' }}
                >
                  Click a category
                </text>
              )}

              {/* Tool count for categories */}
              {node.type === 'category' && node.data && (
                <text
                  textAnchor="middle"
                  dy={node.name.length > 12 ? 22 : 16}
                  fill={mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}
                  fontSize={9}
                  style={{ pointerEvents: 'none' }}
                >
                  {(node.data as Category).tools.length} tools
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderCategoryDetail = () => {
    if (!selectedCategory) return null;

    return (
      <Fade in={true}>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <IconButton
              onClick={() => {
                setSelectedCategory(null);
                setSelectedTool(null);
              }}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: selectedCategory.color },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: selectedCategory.color,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {selectedCategory.name}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {selectedCategory.description}
          </Typography>

          {/* Tools Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {selectedCategory.tools.map((tool, index) => (
              <Zoom key={tool.id} in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                <Card
                  onClick={() => setSelectedTool(tool)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    border: `1px solid ${
                      mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }`,
                    boxShadow: paperCutShadow,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 40px ${selectedCategory.color}30`,
                      borderColor: selectedCategory.color,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {tool.name}
                      </Typography>
                      <Chip
                        label={getOverallRating(tool.ratings).toFixed(1)}
                        size="small"
                        sx={{
                          backgroundColor: selectedCategory.color,
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      by {tool.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                      {tool.description.length > 100
                        ? `${tool.description.substring(0, 100)}...`
                        : tool.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {tool.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: selectedCategory.color,
                            color: selectedCategory.color,
                            fontSize: '0.65rem',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: selectedCategory.color, fontWeight: 600 }}
                    >
                      {tool.pricing}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        </Box>
      </Fade>
    );
  };

  const renderToolDetail = () => {
    if (!selectedTool || !selectedCategory || !data) return null;

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
          onClick={() => setSelectedTool(null)}
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
              border: `2px solid ${selectedCategory.color}`,
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
              <IconButton onClick={() => setSelectedTool(null)}>
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
                          backgroundColor: selectedCategory.color,
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
                <Typography variant="h3" sx={{ fontWeight: 700, color: selectedCategory.color }}>
                  {getOverallRating(selectedTool.ratings).toFixed(1)}
                </Typography>
                <Rating
                  value={getOverallRating(selectedTool.ratings)}
                  precision={0.1}
                  readOnly
                  sx={{
                    '& .MuiRating-iconFilled': { color: selectedCategory.color },
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
                  backgroundColor: `${selectedCategory.color}20`,
                  color: selectedCategory.color,
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
                    sx={{ borderColor: selectedCategory.color, color: selectedCategory.color }}
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
                backgroundColor: selectedCategory.color,
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
                  boxShadow: `0 4px 20px ${selectedCategory.color}50`,
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
                AI Tools Explorer
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Brightness7Icon sx={{ color: mode === 'light' ? 'primary.main' : 'text.secondary' }} />
              <Switch checked={mode === 'dark'} onChange={handleThemeChange} color="secondary" />
              <Brightness4Icon sx={{ color: mode === 'dark' ? 'secondary.main' : 'text.secondary' }} />
            </Box>
          </Box>

          {/* Subtitle */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 6, textAlign: 'center', maxWidth: 600, mx: 'auto' }}
          >
            Explore and compare AI tools across different categories. Click on a category to
            discover tools, and click on a tool to see detailed ratings and information.
          </Typography>

          {/* Mindmap View or Category Detail */}
          {!selectedCategory ? (
            <Box
              ref={containerRef}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 500,
              }}
            >
              {data && renderForceGraph()}
            </Box>
          ) : (
            renderCategoryDetail()
          )}

          {/* Tool Detail Modal */}
          {selectedTool && renderToolDetail()}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AITools;
