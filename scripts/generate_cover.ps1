Add-Type -AssemblyName System.Drawing

$width = 640
$height = 360

$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# 1. Background Gradient (Deep Indigo to Vibrant Cyan/Purple)
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$colorStart = [System.Drawing.Color]::FromArgb(255, 15, 23, 42)    # slate-900
$colorMid   = [System.Drawing.Color]::FromArgb(255, 30, 27, 75)    # indigo-950
$colorEnd   = [System.Drawing.Color]::FromArgb(255, 67, 56, 202)   # indigo-700
$brushGrad  = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colorStart, $colorEnd, 45.0)
$g.FillRectangle($brushGrad, $rect)

# 2. Glowing Accents
$brushGlowCyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 14, 165, 233))
$g.FillEllipse($brushGlowCyan, 400, -50, 300, 300)

$brushGlowAmber = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 245, 158, 11))
$g.FillEllipse($brushGlowAmber, -80, 180, 280, 280)

# 3. Top Decorative Pill Badge
$brushBadge = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
$fontBadge = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$badgeRect = New-Object System.Drawing.RectangleF(190, 28, 260, 32)
$brushBadgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 255, 255, 255))
$g.FillRectangle($brushBadgeBg, 190, 28, 260, 32)
$penBadgeBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 129, 140, 248), 1.5)
$g.DrawRectangle($penBadgeBorder, 190, 28, 260, 32)

$sfCenter = New-Object System.Drawing.StringFormat
$sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
$sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("🎮 TELEGRAM MINI APP 🚀", $fontBadge, $brushBadge, $badgeRect, $sfCenter)

# 4. Main App Title "LinguaQuest"
$fontTitle = New-Object System.Drawing.Font("Arial", 44, [System.Drawing.FontStyle]::Bold)
$brushTitleShadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 10, 10, 25))
$brushTitle = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$titleRectShadow = New-Object System.Drawing.RectangleF(0, 78, $width, 65)
$titleRect = New-Object System.Drawing.RectangleF(0, 75, $width, 65)
$g.DrawString("LinguaQuest", $fontTitle, $brushTitleShadow, $titleRectShadow, $sfCenter)
$g.DrawString("LinguaQuest", $fontTitle, $brushTitle, $titleRect, $sfCenter)

# 5. Golden Gradient Underline Accent
$penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 251, 191, 36), 3.0)
$g.DrawLine($penGold, 220, 145, 420, 145)

# 6. Subtitle
$fontSub = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
$brushSub = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 224, 231, 255))
$subRect = New-Object System.Drawing.RectangleF(20, 155, $width - 40, 35)
$g.DrawString("Aprende Inglés & Chino por Voz con IA", $fontSub, $brushSub, $subRect, $sfCenter)

# 7. Two Feature Cards
# Card Left: Inglés
$brushCardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 255, 255, 255))
$penCardBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 1.0)
$g.FillRectangle($brushCardBg, 45, 205, 260, 95)
$g.DrawRectangle($penCardBorder, 45, 205, 260, 95)

$fontCardTitle = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Bold)
$fontCardDesc = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Regular)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushSlate = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 203, 213, 225))

$g.DrawString("🇬🇧 INGLÉS (B1 / B2 / C1)", $fontCardTitle, $brushWhite, 60, 218)
$g.DrawString("• Conversación con Sir Arthur`n• Dicción por voz y Discord talk", $fontCardDesc, $brushSlate, 60, 245)

# Card Right: Chino
$g.FillRectangle($brushCardBg, 335, 205, 260, 95)
$g.DrawRectangle($penCardBorder, 335, 205, 260, 95)

$g.DrawString("🇨🇳 CHINO (HSK 3.0 DESDE 0)", $fontCardTitle, $brushWhite, 350, 218)
$g.DrawString("• Teclado adaptado Pinyin`n• Tonos y Maestro Long con IA", $fontCardDesc, $brushSlate, 350, 245)

# 8. Bottom Tagline: Padre vs Hijo
$fontFoot = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 253, 224, 71))
$footRect = New-Object System.Drawing.RectangleF(0, 315, $width, 25)
$g.DrawString("⚡ Duelos Familiares en Vivo • Voces Manga • Marcador Padre vs Hijo 🏆", $fontFoot, $brushGold, $footRect, $sfCenter)

# Save Outputs
$outPng = "C:\gITHUB\idiomas\public\telegram-cover-640x360.png"
$outJpg = "C:\gITHUB\idiomas\public\telegram-cover-640x360.jpg"

$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($outJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$bmp.Dispose()

Write-Output "Cover generated successfully: 640x360 PNG & JPG created."
