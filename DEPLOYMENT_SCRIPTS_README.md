# Deployment Scripts - README

## බාවිතා කරන්නේ කොහොමද

මෙතන scripts 3ක් තියෙනවා:

### 1. `check-status.ps1` - Status පරීක්ෂා කරන්න
**භාවිතය:** සියලු services ක්‍රියාත්මකද කියලා බලන්න
**කාලය:** 5 seconds
**Upload:** නෑ

```powershell
.\check-status.ps1
```

### 2. `restart-only.ps1` - Services Restart කරන්න
**භාවිතය:** Files upload නැතුව services විතරක් restart කරන්න
**කාලය:** 10-15 seconds
**Upload:** නෑ
**Password:** SSH password ඕන වෙයි

```powershell
.\restart-only.ps1
```

### 3. `quick-deploy.ps1` - සම්පූර්ණ Deployment
**භාවිතය:** Code changes කළාම මුළු system එක deploy කරන්න
**කාලය:** 2-3 minutes
**Upload:** ඔව්, සියලුම files upload වෙනවා
**Password:** SSH password ඕන වෙයි (3-4 times)

```powershell
.\quick-deploy.ps1
```

## කවදාද භාවිතා කරන්නේ?

| Situation | Use Script | Upload? |
|-----------|------------|---------|
| Services down වෙලා තියෙනවා | `restart-only.ps1` | නෑ |
| ක්‍රියාත්මකද කියලා බලන්න | `check-status.ps1` | නෑ |
| Code changes කළා | `quick-deploy.ps1` | ඔව් |
| පළමු වතාවට deploy කරනවා | `quick-deploy.ps1` | ඔව් |

## Access URLs

- **Frontend:** http://45.8.149.194:3000
- **Backend API:** http://45.8.149.194:5555/v1/
- **phpMyAdmin:** http://45.8.149.194:8080

## Production Server Credentials

SSH Password ඔබ දන්නවා (server access එකට භාවිතා කරන එක)

## Tips

1. **හැම වෙලාවෙම ඔක්කොම upload කරන්න ඕන නෑ** - Code change නැතිනම් `restart-only.ps1` භාවිතා කරන්න
2. **Quick check** - `check-status.ps1` password නැතුව run වෙන එක
3. **Full deployment** - Frontend හෝ Backend code එකේ changes කළානම් විතරක් `quick-deploy.ps1` භාවිතා කරන්න
