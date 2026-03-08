import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { type FredMetric } from "@/lib/fred";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  severity: string;
  metric_id: string | null;
  read: boolean;
  created_at: string;
}

// Thresholds for "significant" change (percentage point change)
const THRESHOLDS: Record<string, { threshold: number; label: string }> = {
  FEDFUNDS:    { threshold: 0.15, label: "Fed Funds Rate" },
  CPIAUCSL:    { threshold: 0.3,  label: "CPI Inflation" },
  UNRATE:      { threshold: 0.2,  label: "Unemployment Rate" },
  DGS10:       { threshold: 0.2,  label: "10-Year Treasury" },
  DRCCLACBS:   { threshold: 0.3,  label: "Credit Card Delinquency" },
  CSUSHPINSA:  { threshold: 1.0,  label: "Housing Price Index" },
};

function getSeverity(changePercent: number): string {
  const abs = Math.abs(changePercent);
  if (abs >= 2) return "critical";
  if (abs >= 1) return "warning";
  return "info";
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data as unknown as Notification[]);
      setUnreadCount(data.filter((n: any) => !n.read).length);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [user]);

  const clearAll = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user.id);
    setNotifications([]);
    setUnreadCount(0);
  }, [user]);

  const checkAndCreateAlerts = useCallback(async (metrics: FredMetric[]) => {
    if (!user || metrics.length === 0) return;

    // Get today's already-created alerts to avoid duplicates
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("notifications")
      .select("metric_id")
      .eq("user_id", user.id)
      .gte("created_at", today + "T00:00:00Z");

    const existingMetrics = new Set((existing || []).map((e: any) => e.metric_id));

    const newAlerts: Array<{
      user_id: string;
      title: string;
      message: string;
      severity: string;
      metric_id: string;
    }> = [];

    for (const metric of metrics) {
      if (metric.value == null || metric.previousValue == null) continue;
      if (existingMetrics.has(metric.seriesId)) continue;

      const config = THRESHOLDS[metric.seriesId];
      if (!config) continue;

      const change = metric.value - metric.previousValue;
      const absChange = Math.abs(change);

      if (absChange >= config.threshold) {
        const direction = change > 0 ? "rose" : "fell";
        const formatted = metric.unit === "%"
          ? `${absChange.toFixed(2)} pp`
          : absChange.toFixed(1);
        const severity = getSeverity(absChange);

        newAlerts.push({
          user_id: user.id,
          title: `${config.label} ${direction}`,
          message: `${config.label} ${direction} by ${formatted} to ${
            metric.unit === "%" ? `${metric.value.toFixed(2)}%` : metric.value.toFixed(1)
          }. This may affect your financial outlook.`,
          severity,
          metric_id: metric.seriesId,
        });
      }
    }

    if (newAlerts.length > 0) {
      await supabase.from("notifications").insert(newAlerts);
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markAllRead,
    clearAll,
    checkAndCreateAlerts,
  };
}
