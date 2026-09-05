$files = @(
    'V1__Initial_Schema.sql',
    'V2__Add_Search_Optimization_Fields.sql',
    'V3__Add_Matching_Fields.sql',
    'V4__Add_Profile_Views_Table.sql',
    'V5__Premium_System.sql',
    'V6__Likes_And_Matches_Update.sql',
    'V7__Add_User_Status_And_Chat_Optimizations.sql',
    'V8__Add_FCM_Token.sql',
    'V9__Add_Precise_Birth_Information.sql',
    'V10__Import_Cities.sql',
    'V11__Fix_Cities_Id_Type.sql',
    'V12__Create_System_Settings_Table.sql',
    'V13__Create_Support_Ticket_Schema.sql',
    'V14__Security_Enhancements.sql',
    'V15__Create_Verification_And_Audit_Tables.sql',
    'V16__Add_Profile_Boost_System.sql',
    'V17__Extend_Payments_For_Boost.sql',
    'V18__Add_RememberMe_To_RefreshToken.sql',
    'V19__Security_And_UX_Enhancements.sql',
    'V20__Audit_Log_Immutability_Grants.sql',
    'V21__Convert_Preferences_To_JSONB.sql'
)

foreach ($f in $files) {
    Write-Host "Applying migration: $f"
    $path = "srimatch-backend/src/main/resources/db/migration/$f"
    Get-Content -Raw $path | docker exec -i srimatch-postgres psql -U srimatch_user -d srimatch_db
}
Write-Host "All migrations successfully applied."
