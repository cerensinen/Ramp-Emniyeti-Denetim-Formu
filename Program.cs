using Microsoft.EntityFrameworkCore;
using RampEmniyetiApi.Model; 
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Pomelo.EntityFrameworkCore.MySql.Storage;


var builder = WebApplication.CreateBuilder(args);

var formDbConnection = builder.Configuration.GetConnectionString("FormDbConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(formDbConnection, ServerVersion.AutoDetect(formDbConnection));
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5500", "http://127.0.0.1:5500")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();