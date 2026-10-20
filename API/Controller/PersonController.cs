using API.Models;
using API.Service;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller;

[Route("api/[controller]")]
[ApiController]
public class PersonController: ControllerBase
{
    private readonly IPersonService _service;

    public PersonController(IPersonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var people = await _service.GetAll();
        return Ok(people);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var person = await _service.GetById(id);
        return Ok(person);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Person person)
    {
        await _service.Create(person);
        return Ok("Person created successfully!");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Person person)
    {
        var updatedPerson = await _service.Update(id, person);
        if(!updatedPerson) return NotFound();

        return Ok("Person updated successfully");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.Delete(id);
        if(!deleted) return NotFound();

        return Ok("Person deleted successfully");
    }

    [HttpDelete("many")]
    public async Task<IActionResult> DeleteMultiple([FromBody] List<int> ids)
    {
        if(ids == null || ids.Count == 0)
        {
            return BadRequest("Please provide at least one person Id");
        }
        if(ids.Any(id => id <= 0))
        {
            return BadRequest("Invalid person Id");
        }

        var deletedCount = await _service.DeleteMultiple(ids.Distinct().ToList());

        if(deletedCount == 0) return NotFound("No matching people found");

        return Ok(new{message = "People deleted successfully!", deletedCount = deletedCount});
    }
}