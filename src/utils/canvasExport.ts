import { WidgetConfig } from '../types/widget';

export async function exportWidgetAsPng(elementId: string, widget: WidgetConfig): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const width = element.offsetWidth || 346;
  const height = element.offsetHeight || 164;
  const scale = 3; // 3x Retina resolution

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Draw background according to theme
  const r = widget.theme.borderRadius || 24;
  
  // Create rounded rectangle path
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, r);
  ctx.clip();

  if (widget.theme.bgType === 'gradient') {
    const angleRad = (widget.theme.gradientAngle * Math.PI) / 180;
    const x2 = width * Math.cos(angleRad);
    const y2 = height * Math.sin(angleRad);
    const grad = ctx.createLinearGradient(0, 0, Math.max(x2, width), Math.max(y2, height));
    grad.addColorStop(0, widget.theme.gradientFrom);
    grad.addColorStop(1, widget.theme.gradientTo);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (widget.theme.bgType === 'solid') {
    ctx.fillStyle = widget.theme.bgColor.startsWith('#') ? widget.theme.bgColor : '#0f172a';
    ctx.fillRect(0, 0, width, height);
  } else {
    // Glass/dark fallback
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
  }

  // Draw hairline border if enabled
  if (widget.theme.glassBorder) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
  }

  // Draw Primary Text
  ctx.fillStyle = widget.theme.textColor.startsWith('#') ? widget.theme.textColor : '#ffffff';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(widget.weather.city.toUpperCase(), 18, 30);

  // Draw Accent
  ctx.fillStyle = widget.theme.accentColor;
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  const tempStr = `${widget.weather.temperature}°${widget.weather.unit}`;
  const tempWidth = ctx.measureText(tempStr).width;
  ctx.fillText(tempStr, width - tempWidth - 18, 30);

  // Draw Large Clock
  const now = new Date();
  const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')}`;
  ctx.fillStyle = widget.theme.textColor.startsWith('#') ? widget.theme.textColor : '#ffffff';
  ctx.font = '800 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(timeStr, 18, 80);

  // Draw Secondary Agenda
  ctx.fillStyle = widget.theme.subtextColor.startsWith('#') ? widget.theme.subtextColor : '#94a3b8';
  ctx.font = '500 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(`📅 ${widget.calendar.nextEventTitle}`, 18, 110);

  // Draw Bottom Battery & Status
  ctx.font = '600 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(`⚡ Battery: ${widget.battery.phoneLevel}% · GlanceCraft`, 18, height - 16);

  // Convert to image download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `glancecraft-widget-${widget.type}-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
