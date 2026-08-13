"use client";
import { PageHeader, Card, RowLink, Banner } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function SettingsHome() {
  const { data, loading } = useApi<any>("/api/settings");
  if (loading) return <LoadingGrid />;
  const s = data?.settings || {};
  return (
    <div>
      <PageHeader title="الإعدادات" />
      {!s.api_id && <Banner tone="danger">API غير مضبوط — النظام معطّل</Banner>}
      <Card className="mb-4">
        <div className="font-bold text-navy">بطاقة النظام</div>
        <div className="mt-2 text-sm">الإصدار: v {s.version||"1.0.0"}</div>
        <div className="text-sm">الحالة: 🟢 يعمل بشكل طبيعي</div>
        <div className="text-sm">API: {s.api_id? "✅ متصل":"❌ غير مضبوط"}</div>
      </Card>
      <div className="space-y-2">
        <RowLink href="/settings/api" icon="🔑" title="مفاتيح API" hint="إلزامي" badge={!s.api_id? <span className="chip bg-danger-soft text-danger">ناقص</span>:undefined} />
        <RowLink href="/settings/limits" icon="📊" title="الحدود الافتراضية" />
        <RowLink href="/settings/paths" icon="📁" title="مسارات التخزين" />
        <RowLink href="/settings/notifications" icon="🔔" title="الإشعارات" />
        <RowLink href="/settings/security" icon="🛡️" title="الأمان والحماية" />
        <RowLink href="/settings/appearance" icon="🌐" title="اللغة والمظهر" />
        <RowLink href="/settings/database" icon="🗄️" title="قاعدة البيانات" />
        <RowLink href="/settings/logging" icon="📋" title="التسجيل" />
        <RowLink href="/settings/schedule" icon="⏰" title="الجدولة التلقائية" />
        <RowLink href="/settings/access" icon="🔒" title="أمان الوصول" />
        <RowLink href="/settings/backup" icon="💾" title="النسخ الاحتياطي" />
        <RowLink href="/settings/performance" icon="⚡" title="الأداء" />
        <RowLink href="/settings/about" icon="ℹ️" title="معلومات النظام" />
        <RowLink href="/settings/reset" icon="↩️" title="إعادة الافتراضي" />
        <RowLink href="/settings/health-check" icon="🔍" title="فحص ذكي شامل" />
        <RowLink href="/settings/export-csv" icon="📤" title="تصدير CSV للجداول" />
        <RowLink href="/settings/login-log" icon="🧾" title="سجل محاولات الدخول" />
      </div>
    </div>
  );
}
