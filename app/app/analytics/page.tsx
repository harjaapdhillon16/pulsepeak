// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardBody, CardFooter, Spinner, Button, Chip, Progress, Divider } from "@nextui-org/react";
import { CalendarDays, TrendingUp, Flame, Award, Calendar, ArrowUp, ArrowDown, BarChart3, Activity } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import AuthButton from '@/components/AuthButton';
import { useRouter } from "next/navigation";

const FitnessAnalyticsDashboard = () => {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [workoutData, setWorkoutData] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [overallStats, setOverallStats] = useState({ total: 0, attended: 0, skipped: 0, attendanceRate: 0 });
    const [dayOfWeekPatterns, setDayOfWeekPatterns] = useState([]);
    const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [bestAndWorstDays, setBestAndWorstDays] = useState({
        best: { day: "Not enough data", attendanceRate: 0 },
        worst: { day: "Not enough data", attendanceRate: 0 }
    });
    const [attendanceTrend, setAttendanceTrend] = useState({ trend: "neutral", description: "Not enough data" });
    const [error, setError] = useState(null);

    // Color schemes
    const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];
    const RADIAN = Math.PI / 180;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get the user data
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    throw new Error("User not authenticated");
                }
                
                // Fetch user profile data
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", 'baidwangursimran3@gmail.com')
                    .single();
                
                if (userError) throw userError;
                if (!userData) throw new Error("User profile not found");
                
                // Get the user's WhatsApp number from their profile
                const whatsappNumber = userData?.whatsapp_number?.replace("+", "");
                
                if (!whatsappNumber) {
                    throw new Error("WhatsApp number not found in user profile");
                }
                
                // Fetch workout responses
                const { data: userResponsesData, error: responseError } = await supabase
                    .from("user_responses")
                    .select("*")
                    .eq("whatsapp_number", whatsappNumber)
                    .order("created_at", { ascending: false });
                
                if (responseError) throw responseError;
                
                if (userResponsesData && userResponsesData.length > 0) {
                    // Process the fetched data
                    const processedData = processWorkoutData(userResponsesData);
                    const monthlyStatsData = getMonthlyStats(processedData);
                    const overallStatsData = getOverallStats(processedData);
                    const dayPatterns = getDayOfWeekPatterns(processedData);
                    const streakInfo = getStreakData(processedData);
                    const recentActivityData = getRecentActivity(processedData);
                    const bestWorstDays = getBestAndWorstDays(dayPatterns);
                    const trendData = getAttendanceTrend(monthlyStatsData);
                    
                    // Update state with the processed data
                    setWorkoutData(processedData);
                    setMonthlyStats(monthlyStatsData);
                    setOverallStats(overallStatsData);
                    setDayOfWeekPatterns(dayPatterns);
                    setStreakData(streakInfo);
                    setRecentActivity(recentActivityData);
                    setBestAndWorstDays(bestWorstDays);
                    setAttendanceTrend(trendData);
                } else {
                    // No workout data found
                    setWorkoutData([]);
                    setMonthlyStats([]);
                    setOverallStats({ total: 0, attended: 0, skipped: 0, attendanceRate: 0 });
                    setDayOfWeekPatterns([]);
                    setStreakData({ currentStreak: 0, longestStreak: 0 });
                    setRecentActivity([]);
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [supabase]);

    // Process workout data from Supabase
    const processWorkoutData = (data) => {
        return data.map(item => {
            const date = new Date(item.created_at);
            const attended = item.whatsapp_response.toLowerCase().includes('yes');
            return {
                id: item.id,
                date,
                dateString: formatDate(date),
                attended,
                status: attended ? 'Attended' : 'Skipped',
                rawResponse: item.whatsapp_response
            };
        });
    };
    
    // Format date in a user-friendly way
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Group sessions by month
    const getMonthlyStats = (processedData) => {
        if (!processedData || processedData.length === 0) return [];
        
        const monthlyData = {};

        processedData.forEach(item => {
            const month = item.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { total: 0, attended: 0, skipped: 0 };
            }

            monthlyData[month].total += 1;
            if (item.attended) {
                monthlyData[month].attended += 1;
            } else {
                monthlyData[month].skipped += 1;
            }
        });

        // Convert to array for easier use in charts
        return Object.keys(monthlyData).map(month => ({
            month,
            ...monthlyData[month],
            attendanceRate: Math.round((monthlyData[month].attended / monthlyData[month].total) * 100)
        })).sort((a, b) => {
            // Sort by date
            const [aMonth, aYear] = a.month.split(' ');
            const [bMonth, bYear] = b.month.split(' ');
            
            if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
            
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.indexOf(aMonth) - months.indexOf(bMonth);
        });
    };

    // Calculate overall stats
    const getOverallStats = (processedData) => {
        if (!processedData || processedData.length === 0) {
            return { total: 0, attended: El, skipped: 0, attendanceRate: 0 };
        }
        
        const total = processedData.length;
        const attended = processedData.filter(item => item.attended).length;
        const skipped = total - attended;

        return {
            total,
            attended,
            skipped,
            attendanceRate: total > 0 ? Math.round((attended / total) * 100) : 0
        };
    };

    // Get day-of-week patterns
    const getDayOfWeekPatterns = (processedData) => {
        if (!processedData || processedData.length === 0) return [];
        
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayStats = daysOfWeek.map(day => ({ day, total: 0, attended: 0, skipped: 0 }));

        processedData.forEach(item => {
            const dayIndex = item.date.getDay();
            dayStats[dayIndex].total += 1;

            if (item.attended) {
                dayStats[dayIndex].attended += 1;
            } else {
                dayStats[dayIndex].skipped += 1;
            }
        });

        // Calculate success rates and only include days with data
        return dayStats
            .map(stat => ({
                ...stat,
                attendanceRate: stat.total > 0 ? Math.round((stat.attended / stat.total) * 100) : 0
            }))
            .filter(stat => stat.total > 0); // Only include days with data
    };

    // Calculate streak data
    const getStreakData = (processedData) => {
        if (!processedData || processedData.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }
        
        // Sort by date (oldest first)
        const sortedData = [...processedData].sort((a, b) => a.date - b.date);

        let currentStreak = 0;
        let longestStreak = 0;

        // Calculate current streak (consecutive attended sessions starting from most recent)
        for (let i = sortedData.length - 1; i >= 0; i--) {
            if (sortedData[i].attended) {
                currentStreak++;
            } else {
                break;
            }
        }

        // Calculate longest streak
        let currentCount = 0;
        for (let i = 0; i < sortedData.length; i++) {
            if (sortedData[i].attended) {
                currentCount++;
                longestStreak = Math.max(longestStreak, currentCount);
            } else {
                currentCount = 0;
            }
        }

        return {
            currentStreak,
            longestStreak
        };
    };

    // Get recent attendance data (last 10 sessions)
    const getRecentActivity = (processedData) => {
        if (!processedData || processedData.length === 0) return [];
        
        return [...processedData]
            .sort((a, b) => b.date - a.date)
            .slice(0, 10);
    };

    // Calculate trend over recent months
    const getAttendanceTrend = (monthlyStats) => {
        if (!monthlyStats || monthlyStats.length < 2) {
            return { trend: "neutral", description: "Not enough data" };
        }

        const recentMonths = monthlyStats.slice(-3);

        if (recentMonths.length >= 2) {
            const firstMonth = recentMonths[0];
            const lastMonth = recentMonths[recentMonths.length - 1];
            
            const trend = lastMonth.attendanceRate - firstMonth.attendanceRate;
            
            if (trend > 15) return { trend: "strong-positive", description: "Strong improvement" };
            if (trend > 5) return { trend: "positive", description: "Improving" };
            if (trend < -15) return { trend: "strong-negative", description: "Significant decline" };
            if (trend < -5) return { trend: "negative", description: "Declining" };
            return { trend: "neutral", description: "Stable" };
        }
        
        return { trend: "neutral", description: "Not enough data" };
    };

    // Get best and worst days
    const getBestAndWorstDays = (dayOfWeekPatterns) => {
        if (!dayOfWeekPatterns || dayOfWeekPatterns.length === 0) {
            return {
                best: { day: "Not enough data", attendanceRate: 0 },
                worst: { day: "Not enough data", attendanceRate: 0 }
            };
        }

        // Filter days with at least 2 sessions for statistical significance
        const significantDays = dayOfWeekPatterns.filter(day => day.total >= 2);

        if (significantDays.length === 0) {
            return {
                best: { day: "Not enough data", attendanceRate: 0 },
                worst: { day: "Not enough data", attendanceRate: 0 }
            };
        }

        const sortedDays = [...significantDays].sort((a, b) => b.attendanceRate - a.attendanceRate);

        return {
            best: sortedDays[0],
            worst: sortedDays[sortedDays.length - 1]
        };
    };

    // Handle loading state with improved feedback
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-screen">
                <div className="relative">
                    <Spinner size="lg" color="primary" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Activity className="w-6 h-6 text-gray-600" />
                    </div>
                </div>
                <p className="mt-4 text-gray-400">Loading your fitness analytics...</p>
                <p className="text-sm text-gray-500 mt-2">Analyzing your workout patterns</p>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="w-screen px-4 py-6">
                <nav className="w-full flex justify-center h-24">
                    <div className="w-full flex justify-between items-center p-3 text-sm max-w-5xl">
                        <img
                            className="h-16 w-16"
                            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
                            alt="Logo"
                        />
                        <AuthButton />
                    </div>
                </nav>
                
                <div className="p-3 w-full max-w-5xl mx-auto">
                    <Button
                        onClick={() => router.push("/")}
                        variant="flat"
                        color="primary"
                    >
                        Back
                    </Button>
                </div>
                
                <div className="max-w-5xl mx-auto p-6 bg-red-900/20 border border-red-800/30 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Unable to load analytics</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <Button 
                        color="primary" 
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const renderOverviewTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Key Stats Cards */}
            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-700/30 shadow-lg">
                <CardBody className="flex flex-col items-center justify-center p-6">
                    <div className="mb-4 p-3 bg-blue-500/20 rounded-full">
                        <Activity className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold">{overallStats.attendanceRate}%</h3>
                    <p className="text-gray-400">Overall Attendance Rate</p>
                    <div className="w-full mt-4">
                        <Progress
                            value={overallStats.attendanceRate}
                            color={overallStats.attendanceRate > 70 ? "success" : overallStats.attendanceRate > 40 ? "warning" : "danger"}
                            className="h-3"
                        />
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-700/30 shadow-lg">
                <CardBody className="flex flex-col items-center justify-center p-6">
                    <div className="mb-4 p-3 bg-purple-500/20 rounded-full">
                        <Flame className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="flex items-baseline">
                        <h3 className="text-2xl font-bold">{streakData.currentStreak}</h3>
                        <span className="text-sm text-gray-400 ml-1">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-gray-400">Current Streak</p>
                    <p className="mt-2 text-sm text-gray-500">Longest: {streakData.longestStreak} days</p>
                </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 border border-emerald-700/30 shadow-lg">
                <CardBody>
                    <div className="flex flex-col items-center justify-center p-2">
                        <div className="mb-4 p-3 bg-emerald-500/20 rounded-full">
                            <TrendingUp className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold">Trend: {attendanceTrend.description}</h3>
                        <div className="my-3 flex items-center">
                            {attendanceTrend.trend.includes('positive') ? (
                                <ArrowUp className="w-5 h-5 text-green-500 mr-1" />
                            ) : attendanceTrend.trend.includes('negative') ? (
                                <ArrowDown className="w-5 h-5 text-red-500 mr-1" />
                            ) : (
                                <span className="w-5 h-5 inline-block mr-1">—</span>
                            )}
                            <span className={`
                ${attendanceTrend.trend.includes('positive') ? 'text-green-500' : ''}
                ${attendanceTrend.trend.includes('negative') ? 'text-red-500' : ''}
                ${attendanceTrend.trend === 'neutral' ? 'text-gray-400' : ''}
              `}>
                                {attendanceTrend.trend.includes('strong') ? 'Significant Change' : 'Moderate Change'}
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Monthly Attendance Chart */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-700/30 shadow-lg">
                <CardHeader className="flex flex-col items-start pb-0">
                    <h3 className="text-xl font-bold">Monthly Attendance</h3>
                    <p className="text-sm text-gray-400">Tracking your workout consistency</p>
                </CardHeader>
                <CardBody>
                    {monthlyStats.length > 0 ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyStats}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" orientation="left" />
                                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                                        formatter={(value, name) => {
                                            if (name === 'attendanceRate') return [`${value}%`, 'Attendance Rate'];
                                            return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                                        }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="attended" name="Attended" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="left" dataKey="skipped" name="Skipped" fill="#f87171" radius={[4, 4, 0, 0]} />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="attendanceRate"
                                        name="Attendance Rate"
                                        stroke="#60a5fa"
                                        strokeWidth={3}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center">
                            <p className="text-gray-400">No monthly data available yet</p>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Day of Week Performance */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-700/30 shadow-lg">
                <CardHeader className="flex flex-col items-start pb-0">
                    <h3 className="text-xl font-bold">Performance by Day</h3>
                    <p className="text-sm text-gray-400">Which days you perform best</p>
                </CardHeader>
                <CardBody>
                    {dayOfWeekPatterns.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dayOfWeekPatterns}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="day" />
                                    <YAxis domain={[0, 100]} unit="%" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                                        formatter={(value) => [`${value}%`, 'Attendance Rate']}
                                    />
                                    <Bar dataKey="attendanceRate" name="Attendance Rate" fill="#3b82f6">
                                        {dayOfWeekPatterns.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.day === bestAndWorstDays.best.day ? '#4ade80' :
                                                    entry.day === bestAndWorstDays.worst.day ? '#f87171' : '#3b82f6'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-gray-400">No day pattern data available yet</p>
                        </div>
                    )}
                </CardBody>
                {dayOfWeekPatterns.length > 0 && (
                    <CardFooter className="text-sm border-t border-gray-700 flex flex-wrap gap-3">
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                            <span>Best: {bestAndWorstDays.best.day} ({bestAndWorstDays.best.attendanceRate}%)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                            <span>Worst: {bestAndWorstDays.worst.day} ({bestAndWorstDays.worst.attendanceRate}%)</span>
                        </div>
                    </CardFooter>
                )}
            </Card>

            {/* Overall Distribution Pie Chart */}
            <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-700/30 shadow-lg">
                <CardHeader className="flex flex-col items-start pb-0">
                    <h3 className="text-xl font-bold">Session Distribution</h3>
                    <p className="text-sm text-gray-400">Attended vs Skipped</p>
                </CardHeader>
                <CardBody>
                    {overallStats.total > 0 ? (
                        <div className="h-64 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Attended', value: overallStats.attended },
                                            { name: 'Skipped', value: overallStats.skipped },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    fill="#fff"
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                >
                                                    {`${name} ${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                        outerRadius={80}
                                        dataKey="value"
                                    >
                                        <Cell fill="#4ade80" />
                                        <Cell fill="#f87171" />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                                        formatter={(value) => [value, 'Sessions']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-gray-400">No session data available yet</p>
                        </div>
                    )}
                </CardBody>
                {overallStats.total > 0 && (
                    <CardFooter className="text-sm border-t border-gray-700">
                        <div className="w-full flex justify-around">
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                                <span>Attended: {overallStats.attended}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                                <span>Skipped: {overallStats.skipped}</span>
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );

    const renderActivityTab = () => (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-700/30 shadow-lg">
                <CardHeader className="flex flex-col items-start">
                    <h3 className="text-xl font-bold">Recent Activity</h3>
                    <p className="text-sm text-gray-400">Your last {Math.min(10, recentActivity.length)} workout sessions</p>
                </CardHeader>
                <CardBody className="px-0">
                    {recentActivity.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-3 px-6 text-left">Date & Time</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                        <th className="py-3 px-6 text-left">Response</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentActivity.map((activity) => (
                                        <tr key={activity.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                            <td className="py-3 px-6">{activity.dateString}</td>
                                            <td className="py-3 px-6">
                                                <Chip
                                                    color={activity.attended ? "success" : "danger"}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {activity.status}
                                                </Chip>
                                            </td>
                                            <td className="py-3 px-6 text-gray-400 text-sm">
                                                {activity.rawResponse}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-400">No activity data available yet</p>
                        </div>
                    )}
                </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-700/30 shadow-lg">
                <CardHeader className="flex flex-col items-start">
                    <h3 className="text-xl font-bold">Monthly Breakdown</h3>
                    <p className="text-sm text-gray-400">Your performance each month</p>
                </CardHeader>
                <CardBody className="px-0">
                    {monthlyStats.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-3 px-6 text-left">Month</th>
                                        <th className="py-3 px-6 text-center">Sessions</th>
                                        <th className="py-3 px-6 text-center">Attended</th>
                                        <th className="py-3 px-6 text-center">Skipped</th>
                                        <th className="py-3 px-6 text-center">Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyStats.map((month, index) => (
                                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                                            <td className="py-3 px-6">{month.month}</td>
                                            <td className="py-3 px-6 text-center">{month.total}</td>
                                            <td className="py-3 px-6 text-center text-green-500">{month.attended}</td>
                                            <td className="py-3 px-6 text-center text-red-500">{month.skipped}</td>
                                            <td className="py-3 px-6 text-center">
                                                <Chip
                                                    color={month.attendanceRate > 70 ? "success" : month.attendanceRate > 40 ? "warning" : "danger"}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {month.attendanceRate}%
                                                </Chip>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-400">No monthly data available yet</p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );

    const renderInsightsTab = () => (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 border border-indigo-700/30 shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-4">Workout Insights</h3>

                        {workoutData.length > 0 ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                                        Best Day to Work Out
                                    </h4>
                                    {bestAndWorstDays.best.day !== "Not enough data" ? (
                                        <>
                                            <p className="text-gray-300">{bestAndWorstDays.best.day}s have your highest attendance rate at {bestAndWorstDays.best.attendanceRate}%.</p>
                                            <p className="text-sm text-gray-400 mt-1">Consider scheduling important workouts on this day.</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-300">Need more data to determine your best workout day.</p>
                                    )}
                                </div>

                                <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <Award className="w-5 h-5 mr-2 text-amber-400" />
                                        Streak Potential
                                    </h4>
                                    <p className="text-gray-300">Your longest streak is {streakData.longestStreak} days.</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        You're currently on a {streakData.currentStreak}-day streak. 
                                        {streakData.currentStreak > 0 ? " Keep it going!" : " Start a new streak today!"}
                                    </p>
                                </div>

                                <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                                        Attendance Trend
                                    </h4>
                                    {attendanceTrend.description !== "Not enough data" ? (
                                        <>
                                            <p className={`text-gray-300 ${
                                                attendanceTrend.trend.includes('positive') ? 'text-green-400' :
                                                attendanceTrend.trend.includes('negative') ? 'text-red-400' : ''
                                            }`}>
                                                Your attendance is {attendanceTrend.description.toLowerCase()}.
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {attendanceTrend.trend.includes('negative')
                                                    ? "Try setting reminders or finding a workout buddy to improve consistency."
                                                    : attendanceTrend.trend.includes('positive')
                                                        ? "Great job maintaining your consistency!"
                                                        : "Keep a consistent schedule to improve your fitness results."}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-gray-300">Need more data over multiple months to analyze trends.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                <p className="text-gray-300">Start tracking your workouts to see personalized insights here.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-4">Recommendations</h3>

                        {workoutData.length > 0 ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                    <h4 className="font-semibold mb-2">Improve Your Consistency</h4>
                                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                                        {bestAndWorstDays.best.day !== "Not enough data" && (
                                            <li>Schedule workouts on {bestAndWorstDays.best.day}s when you're most likely to attend</li>
                                        )}
                                        <li>Find a workout buddy for accountability</li>
                                        <li>Set reminders 30 minutes before your planned workout time</li>
                                        <li>Track your progress to stay motivated</li>
                                    </ul>
                                </div>

                                {bestAndWorstDays.worst.day !== "Not enough data" && (
                                    <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                        <h4 className="font-semibold mb-2">Areas to Focus On</h4>
                                        <p className="text-gray-300 mb-2">Your attendance on {bestAndWorstDays.worst.day}s is only {bestAndWorstDays.worst.attendanceRate}%.</p>
                                        <p className="text-gray-300">Try these strategies to improve:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                                            <li>Schedule easier workouts for challenging days</li>
                                            <li>Find a class or activity you enjoy</li>
                                            <li>Prepare your workout clothes and gear in advance</li>
                                        </ul>
                                    </div>
                                )}
                                
                                {overallStats.attendanceRate < 50 && (
                                    <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                        <h4 className="font-semibold mb-2">Boosting Your Attendance</h4>
                                        <p className="text-gray-300 mb-2">Your current attendance rate is {overallStats.attendanceRate}%.</p>
                                        <p className="text-gray-300">Consider these tips:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                                            <li>Set more realistic workout goals</li>
                                            <li>Try shorter, more frequent workout sessions</li>
                                            <li>Find activities you genuinely enjoy</li>
                                            <li>Track and celebrate small improvements</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-700">
                                <p className="text-gray-300">Start tracking your workouts to receive personalized recommendations.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="w-screen px-4 py-6">
            <nav className="w-full flex justify-center h-24">
                <div className="w-full flex justify-between items-center p-3 text-sm max-w-5xl">
                    <img
                        className="h-16 w-16"
                        src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
                        alt="Logo"
                    />
                    <AuthButton />
                </div>
            </nav>

            <div className="w-full max-w-5xl mx-auto">
                <div className="mb-4">
                    <Button
                        onClick={() => router.push("/")}
                        variant="flat"
                        color="primary"
                        className="mb-4"
                    >
                        Back
                    </Button>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Fitness Analytics</h2>
                    <p className="text-gray-400">Track your workout consistency and progress</p>
                    {workoutData.length === 0 && (
                        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                            <p className="text-sm text-blue-300">
                                No workout data found. Start recording your workouts to see analytics here.
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                        color={activeTab === 'overview' ? 'primary' : 'default'}
                        variant={activeTab === 'overview' ? 'solid' : 'flat'}
                        className="flex items-center gap-2"
                        onPress={() => setActiveTab('overview')}
                    >
                        <BarChart3 size={18} /> Overview
                    </Button>
                    <Button
                        color={activeTab === 'activity' ? 'primary' : 'default'}
                        variant={activeTab === 'activity' ? 'solid' : 'flat'}
                        className="flex items-center gap-2"
                        onPress={() => setActiveTab('activity')}
                    >
                        <Activity size={18} /> Activity Log
                    </Button>
                    <Button
                        color={activeTab === 'insights' ? 'primary' : 'default'}
                        variant={activeTab === 'insights' ? 'solid' : 'flat'}
                        className="flex items-center gap-2"
                        onPress={() => setActiveTab('insights')}
                    >
                        <BarChart3 size={18} /> Insights
                    </Button>
                </div>

                {/* Tab Content */}
                <div className="w-full">
                    {activeTab === 'overview' && renderOverviewTab()}
                    {activeTab === 'activity' && renderActivityTab()}
                    {activeTab === 'insights' && renderInsightsTab()}
                </div>
            </div>
        </div>
    );
};

export default FitnessAnalyticsDashboard;